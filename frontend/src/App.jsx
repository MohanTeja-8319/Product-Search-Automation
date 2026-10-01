import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Login, Register, Logout } from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ResetPassword from "./Pages/ResetPassword";
import Home from "./Pages/Home";
import Landing from "./Pages/Landing";
import CategoriesPage from "./Pages/CategoriesPage";
import SearchPage from "./Pages/SearchPage";
import Wishlist from "./Pages/Wishlist";
import Comparison from "./Pages/Comparison";
import ProductDetails from "./Pages/ProductDetail";
import ComparisonPage from "./Pages/ComparisionPage";
import HistoryPage from "./Pages/HistoryPage";
import Settings from "./Pages/Settings";
import HelpSupport from "./Pages/HelpSupport";

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
import AdminCategories from "./admin/pages/AdminCategories";
import AdminSearches from "./admin/pages/AdminSearches";
import AdminSearchDetails from "./admin/pages/AdminSearchDetails";
import AdminSources from "./admin/pages/AdminSources";
import AdminAutomation from "./admin/pages/AdminAutomation";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import AdminReviews from "./admin/pages/AdminReviews";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminLogs from "./admin/pages/AdminLogs";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '8px' } }} />
      <AdminAuthProvider>
        <AdminToastProvider>
          <AdminDataProvider>
            <Routes>
              {/* User Storefront Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
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
              <Route path="/pricealerts" element={<PriceAlerts />} />
              <Route path="/price-alerts" element={<PriceAlerts />} />
              <Route path="/alerts" element={<PriceAlerts />} />

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Comparely Admin Control Center */}
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
                <Route path="categories" element={<AdminCategories />} />
                <Route path="searches" element={<AdminSearches />} />
                <Route path="searches/:id" element={<AdminSearchDetails />} />
                <Route path="sources" element={<AdminSources />} />
                <Route path="jobs" element={<AdminAutomation />} />
                <Route path="automation" element={<AdminAutomation />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="settings" element={<AdminSettings />} />
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