import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login, Register, Logout } from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ResetPassword from "./Pages/ResetPassword";
import Home from "./Pages/Home";
import CategoriesPage from "./Pages/CategoriesPage";
import SearchPage from "./Pages/SearchPage";
import Wishlist from "./Pages/Wishlist";
import Comparison from "./Pages/Comparison";
import ProductDetails from "./Pages/ProductDetail";
import ComparisonPage from "./Pages/ComparisionPage";
import HistoryPage from "./Pages/HistoryPage";
import Settings from "./Pages/Settings";
import HelpSupport from "./Pages/HelpSupport";
import CreateAlert from "./Components/CreateAlerts";
import PriceAlerts from "./Components/PriceAlertsMain";

// Admin Contexts
import { AdminAuthProvider, AdminProtectedRoute } from "./admin/context/AdminAuthContext";
import { AdminToastProvider } from "./admin/context/AdminToastContext";
import { AdminDataProvider } from "./admin/context/AdminDataContext";

// Admin Components & Pages
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminUserDetails from "./admin/pages/AdminUserDetails";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminProductDetails from "./admin/pages/AdminProductDetails";
import AdminSearches from "./admin/pages/AdminSearches";
import AdminSearchDetails from "./admin/pages/AdminSearchDetails";
import AdminAutomation from "./admin/pages/AdminAutomation";
import AdminSources from "./admin/pages/AdminSources";
import AdminLogs from "./admin/pages/AdminLogs";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminToastProvider>
          <AdminDataProvider>
            <Routes>
              {/* User Client Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/verify-code" element={<VerifyOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/compare" element={<Comparison />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<HelpSupport />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/comparison/:productName" element={<ComparisonPage />} />
              <Route path="/createalerts" element={<CreateAlert />} />
              <Route path="/pricealerts" element={<PriceAlerts />} />

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Console Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetails />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/:id" element={<AdminProductDetails />} />
                <Route path="searches" element={<AdminSearches />} />
                <Route path="searches/:id" element={<AdminSearchDetails />} />
                <Route path="automation" element={<AdminAutomation />} />
                <Route path="sources" element={<AdminSources />} />
                <Route path="logs" element={<AdminLogs />} />
              </Route>
            </Routes>
          </AdminDataProvider>
        </AdminToastProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;