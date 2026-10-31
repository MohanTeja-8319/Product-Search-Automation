import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  getAdminToken,
  setAdminToken,
  clearAdminToken,
  adminRequest,
  adminPost,
  adminPatch,
} from "../utils/adminApi";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem("psa_admin_session");
      const user = stored ? JSON.parse(stored) : null;
      return user && user.isAdmin ? user : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const auth = localStorage.getItem("psa_admin_is_auth");
      const token = getAdminToken();
      return Boolean(auth === "true" && token);
    } catch {
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Verify administrator session with the backend on initialization
  const verifySession = useCallback(async () => {
    let isAdminCandidate = false;
    try {
      if (localStorage.getItem("admin_token") || localStorage.getItem("psa_admin_is_auth") === "true") {
        isAdminCandidate = true;
      }
      const u = localStorage.getItem("user");
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed && parsed.isAdmin) isAdminCandidate = true;
      }
      const session = localStorage.getItem("psa_admin_session");
      if (session) {
        const parsedSession = JSON.parse(session);
        if (parsedSession && parsedSession.isAdmin) isAdminCandidate = true;
      }
    } catch {}

    const token = getAdminToken();

    if (!token || !isAdminCandidate) {
      setIsAuthenticated(false);
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await adminRequest("/admin/me");
      if (data?.user && data.user.isAdmin) {
        setAdminUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("psa_admin_is_auth", "true");
        localStorage.setItem("psa_admin_session", JSON.stringify(data.user));
      } else {
        throw new Error("User does not have admin privileges.");
      }
    } catch (err) {
      clearAdminToken();
      setIsAuthenticated(false);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();

    const handleSessionExpired = () => {
      clearAdminToken();
      setIsAuthenticated(false);
      setAdminUser(null);
    };

    window.addEventListener("admin-auth-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("admin-auth-expired", handleSessionExpired);
    };
  }, [verifySession]);

  const login = async (email, password) => {
    try {
      const data = await adminPost("/admin/login", { email, password });

      if (!data?.token || !data?.user?.isAdmin) {
        throw new Error("Access denied. This account does not possess administrator privileges.");
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("psa_admin_is_auth", "true");
      localStorage.setItem("psa_admin_session", JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      clearAdminToken();
      setIsAuthenticated(false);
      setAdminUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminPost("/auth/logout").catch(() => {});
    } finally {
      clearAdminToken();
      setIsAuthenticated(false);
      setAdminUser(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await adminPatch("/admin/profile", data);
      if (res?.user) {
        setAdminUser(res.user);
        localStorage.setItem("psa_admin_session", JSON.stringify(res.user));
        return res.user;
      }
    } catch (err) {
      console.warn("Failed to update admin profile on server:", err.message);
    }
    setAdminUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfile,
        verifySession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

export function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--adm-bg, #0a0a0a)",
          color: "var(--adm-text, #f4efe8)",
          fontFamily: "'Inter', sans-serif",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid rgba(255, 255, 255, 0.1)",
            borderTopColor: "var(--adm-primary, #ffffff)",
            borderRadius: "50%",
            animation: "admin-spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "var(--adm-muted, #888888)", fontWeight: 500 }}>
          Verifying administrator permissions...
        </span>
        <style>{`
          @keyframes admin-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
