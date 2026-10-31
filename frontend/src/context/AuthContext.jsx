import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  API_BASE_URL,
  loginUser,
  registerUser,
  saveAuth,
  updateStoredUser,
} from "../utils/api";

export function clearAuth() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("searchHistory");
    localStorage.removeItem("recentProducts");
    localStorage.removeItem("wishlistItems");
    localStorage.removeItem("price_scout_notifications");
    localStorage.removeItem("profilePhoto");
  } catch {}

  window.dispatchEvent(new Event("user-profile-updated"));
  window.dispatchEvent(new Event("user-auth-changed"));
}

export async function logoutUser() {
  try {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
  } catch (err) {
    console.warn("Server logout request warning:", err.message);
  } finally {
    clearAuth();
  }
}

export async function restoreSession() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE_URL}/auth/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Comparely-Client": "web",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    let data = null;
    try {
      data = await res.json();
    } catch {}

    if (res.ok && data?.user) {
      const activeToken = data.token || token;
      if (activeToken) {
        saveAuth({ token: activeToken, user: data.user });
      }
      return {
        authenticated: true,
        user: data.user,
        token: activeToken,
      };
    }
  } catch (err) {
    console.warn("Session restoration network error:", err.message);
  }

  // If restoring via /session fails, try refresh endpoint explicitly
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Comparely-Client": "web",
      },
      credentials: "include",
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (res.ok && data?.token) {
      saveAuth(data);
      const storedUser = localStorage.getItem("user");
      let parsedUser = null;
      try { parsedUser = storedUser ? JSON.parse(storedUser) : null; } catch {}
      return {
        authenticated: true,
        user: data.user || parsedUser,
        token: data.token,
      };
    }
  } catch {}

  const storedUser = localStorage.getItem("user");
  if (token && storedUser) {
    try {
      return {
        authenticated: true,
        user: JSON.parse(storedUser),
        token,
      };
    } catch {}
  }

  clearAuth();
  return {
    authenticated: false,
    user: null,
    token: null,
  };
}

const AuthContext = createContext(null);

export function AuthLoadingScreen({ message = "Restoring session..." }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        fontFamily: "'Inter', sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          maxWidth: 360,
        }}
      >
        <img
          src="/logo.png"
          alt="Comparely"
          style={{
            height: 54,
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
          }}
        />
        <div
          style={{
            width: 38,
            height: 38,
            border: "3px solid var(--border)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "comparely-spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            fontSize: 13,
            color: "var(--text-500)",
            letterSpacing: "0.02em",
            margin: 0,
            fontWeight: 500,
          }}
        >
          {message}
        </p>
      </div>
      <style>{`
        @keyframes comparely-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const isMountedRef = useRef(true);

  // Synchronize auth state from localStorage and backend
  const checkSession = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const result = await restoreSession();
      if (!isMountedRef.current) return;

      if (result.authenticated && result.user) {
        setUser(result.user);
        setToken(result.token || localStorage.getItem("token"));
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setUser(null);
      setToken(null);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setSessionChecked(true);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    checkSession(true);

    const handleProfileUpdate = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch {}
    };

    const handleAuthChanged = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        setToken(storedToken || null);
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {}
    };

    const handleSessionExpired = () => {
      clearAuth();
      setUser(null);
      setToken(null);
      toast.error("Session expired. Please log in again.", { id: "session-expired" });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession(false);
      }
    };

    window.addEventListener("user-profile-updated", handleProfileUpdate);
    window.addEventListener("user-auth-changed", handleAuthChanged);
    window.addEventListener("session-expired", handleSessionExpired);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
      window.removeEventListener("user-auth-changed", handleAuthChanged);
      window.removeEventListener("session-expired", handleSessionExpired);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSession]);

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    saveAuth(data);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const register = async (credentials) => {
    const data = await registerUser(credentials);
    saveAuth(data);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      clearAuth();
    } finally {
      setUser(null);
      setToken(null);
      window.dispatchEvent(new Event("user-profile-updated"));
    }
  };

  const updateUser = (patch) => {
    const updated = updateStoredUser(patch);
    setUser(updated);
    return updated;
  };

  const isAuthenticated = Boolean(user && token);

  const value = {
    user,
    token,
    isLoading,
    sessionChecked,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshSession: checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Protected Route Guard for authenticated user destinations
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen message="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Route Guard for public-only pages like /login and /register
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen message="Checking session..." />;
  }

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || "/home";
    return <Navigate to={destination} replace />;
  }

  return children;
}
