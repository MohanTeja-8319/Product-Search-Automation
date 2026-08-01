import { useState } from "react";
import ProductsSection from "../Components/ProductsSection";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import CategorySection from "../Components/CategorySection";

function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6 flex-1">
          <div className="space-y-6">
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
        </main>
      </div>
    </div>
  );
}

export default Dashboard;