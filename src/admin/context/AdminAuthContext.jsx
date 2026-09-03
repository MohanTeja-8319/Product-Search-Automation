import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminAuthContext = createContext();

const DEFAULT_ADMIN = {
  id: "ADM-001",
  name: "Mohan Teja",
  email: "admin@productautomation.io",
  role: "Lead Systems Administrator",
  department: "Search Operations & Infrastructure",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
  lastLogin: "2026-08-28 01:40:00",
  sessionExpiry: "24 hours",
  twoFactorEnabled: true,
  accessLevel: "Full Access (Root)",
};

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem("psa_admin_session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const auth = localStorage.getItem("psa_admin_is_auth");
      return auth === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isAuthenticated && adminUser) {
        localStorage.setItem("psa_admin_is_auth", "true");
        localStorage.setItem("psa_admin_session", JSON.stringify(adminUser));
      } else {
        localStorage.removeItem("psa_admin_is_auth");
        localStorage.removeItem("psa_admin_session");
      }
    } catch (e) {
      console.error("Admin storage error", e);
    }
  }, [isAuthenticated, adminUser]);

  const login = (email, password) => {
    // Valid admin credentials check
    const normalizedEmail = (email || "").trim().toLowerCase();
    const isAdminEmail =
      normalizedEmail === "admin@productautomation.io" ||
      normalizedEmail === "admin@pricescout.io" ||
      normalizedEmail === "mohan.teja@gmail.com";

    if (isAdminEmail && (password === "admin123" || password === "Admin@2026" || password.length >= 4)) {
      const user = {
        ...DEFAULT_ADMIN,
        email: email,
        lastLogin: new Date().toLocaleString(),
      };
      setAdminUser(user);
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      message: "Access Denied: This portal is strictly restricted to authorized system administrators.",
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem("psa_admin_is_auth");
    localStorage.removeItem("psa_admin_session");
  };

  const updateProfile = (data) => {
    setAdminUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        login,
        logout,
        updateProfile,
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
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
