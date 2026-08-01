import { useState } from "react";
import ProductsSection from "../Components/ProductsSection";
import Sidebar from "../Components/RightNavbar";
import Navbar from "../Components/Navbar1";
import CategorySection from "../Components/CategorySection";
import RightSidebar from "../Components/RightSidebar";

function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  console.log(selectedCategory);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 border-r bg-white">
         <Sidebar />
      </div>

      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <Navbar />

        <div className="p-6">
<CategorySection
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
/>
<ProductsSection
  selectedCategory={selectedCategory}
  wishlist={wishlist}
  setWishlist={setWishlist}
/>

        </div>
      </div>

      <RightSidebar />
    </div>
  );
}

export default Dashboard;