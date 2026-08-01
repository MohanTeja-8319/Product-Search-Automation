import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";
import SearchPage from "./Pages/SearchPage";
import Wishlist from "./Pages/Wishlist";
import Comparison from "./Pages/Comparison";
import Logout from "./Pages/Logout";
import Dashboard from "./Pages/Dashboard";
import ProductDetails from "./Pages/ProductDetail";
import ComparisonPage from "./Pages/ComparisionPage";
import PriceAlert from "./Pages/PriceAlert";
import SettingsPage from "./Pages/SettingsPage";
import HelpSupportPage from "./Pages/HelpSupportPage";
import HistoryPage from "./Pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/categories" element={<Dashboard />} />
        <Route path="/price-alerts" element={<PriceAlert />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/comparison/:productName" element={<ComparisonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;