import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminAuthContext = createContext();

const DEFAULT_ADMIN = {
  id: "ADM-001",
  name: "Admin",
  email: "admin@comparely.io",
  role: "Lead Platform Administrator",
  department: "Comparely Infrastructure & Search Operations",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
  lastLogin: new Date().toLocaleString(),
  sessionExpiry: "24 hours",
  twoFactorEnabled: true,
  accessLevel: "Full Access (Root)",
};

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem("psa_admin_session");
      return stored ? JSON.parse(stored) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const auth = localStorage.getItem("psa_admin_is_auth");
      return auth === "true" || auth === null; // Default true so admin is directly accessible
    } catch {
      return true;
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
    const user = {
      ...DEFAULT_ADMIN,
      email: email?.trim() || "admin@comparely.io",
      name: email?.includes("@") ? email.split("@")[0].toUpperCase() : "Admin",
      lastLogin: new Date().toLocaleString(),
    };
    setAdminUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("psa_admin_is_auth", "true");
      localStorage.setItem("psa_admin_session", JSON.stringify(user));
    } catch (_) {}
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    try {
      localStorage.removeItem("psa_admin_is_auth");
      localStorage.removeItem("psa_admin_session");
    } catch (_) {}
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
