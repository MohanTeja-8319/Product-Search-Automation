import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";
import SearchPage from "./Pages/SearchPage";
import Dashboard from "./Pages/Dashboard";
import ProductDetails from "./Pages/ProductDetail";
import ComparisonPage from "./Pages/ComparisionPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/categories"  element={<Dashboard/>}  />
         <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/comparison/:productName" element={<ComparisonPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;