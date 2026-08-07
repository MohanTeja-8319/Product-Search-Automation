import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login, Register, ForgotPassword, Logout } from "./Pages/Login";
import Home, { Dashboard } from "./Pages/Home";
import SearchPage from "./Pages/SearchPage";
import Wishlist from "./Pages/Wishlist";
import Comparison from "./Pages/Comparison";
import ProductDetails from "./Pages/ProductDetail";
import ComparisonPage from "./Pages/ComparisionPage";
import PriceAlert from "./Pages/PriceAlert";
import HistoryPage from "./Pages/HistoryPage";
import CreateAlert from "./Components/CreateAlerts";
import PriceAlerts from "./Components/PriceAlertsMain";

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
     
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/comparison/:productName" element={<ComparisonPage />} />
        <Route path="/createalerts" element={<CreateAlert />} />
        <Route path="/pricealerts" element={<PriceAlerts/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;