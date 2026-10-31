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
import StoreOrderingPage from "./Pages/StoreOrderingPage";
import HistoryPage from "./Pages/HistoryPage";
import Settings from "./Pages/Settings";
import HelpSupport from "./Pages/HelpSupport";

import PriceAlerts from "./Components/PriceAlertsMain";
import LogoAnimationPage from "./Pages/LogoAnimationPage";
import PwaStatusBanner from "./Components/PwaStatusBanner";

// User Auth Context & Protected Routes
import { AuthProvider, ProtectedRoute, PublicOnlyRoute } from "./context/AuthContext";

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
      <Toaster
        position="top-center"
        containerStyle={{ top: 24, left: 12, right: 12 }}
        toastOptions={{
          style: {
            background: 'var(--surface, #1e293b)',
            color: 'var(--text-900, #f8fafc)',
            border: '1px solid var(--border, #334155)',
            borderRadius: '12px',
            fontSize: '13.5px',
            maxWidth: 'min(420px, 92vw)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
            padding: '12px 16px',
            fontFamily: "'Inter', sans-serif"
          }
        }}
      />
      <PwaStatusBanner />
      <AuthProvider>
        <AdminAuthProvider>
          <AdminToastProvider>
            <AdminDataProvider>
              <Routes>
                {/* User Storefront Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/intro" element={<LogoAnimationPage />} />
                <Route path="/logo-animation" element={<LogoAnimationPage />} />
                <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/verify-code" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/comparison" element={<Comparison />} />
                <Route path="/compare" element={<Comparison />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/support" element={<HelpSupport />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/comparison/:productName" element={<ComparisonPage />} />
              <Route path="/order/:store/:productName" element={<StoreOrderingPage />} />
              <Route path="/order/:store" element={<StoreOrderingPage />} />
              <Route path="/order" element={<StoreOrderingPage />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;