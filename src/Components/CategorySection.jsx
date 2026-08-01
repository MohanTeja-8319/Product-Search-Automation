
import { useState } from "react";
import CategoryCard from "./CategoryCard";
import StatsCard from "./StatsCardcategories";

function CategorySection({
  selectedCategory,
  setSelectedCategory,
}) {
  const [search, setSearch] = useState("");
  

  const categories = [
    { icon: "📱", title: "Mobiles", description: "1000+ Products" },
    { icon: "💻", title: "Laptops", description: "800+ Products" },
    { icon: "🎧", title: "Headphones", description: "600+ Products" },
    { icon: "📺", title: "Televisions", description: "250+ Products" },
    { icon: "⌚", title: "Smartwatches", description: "450+ Products" },
    { icon: "📷", title: "Cameras", description: "300+ Products" },
    { icon: "👜", title: "Accessories", description: "600+ Products" },
    { icon: "📱", title: "Tablets", description: "300+ Products" },
    { icon: "🧊", title: "Home Appliances", description: "400+ Products" },
    { icon: "➡️", title: "All Categories", description: "See all available categories" },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-gray-800">Categories</h2>

      <p className="text-gray-500 mt-2 mb-6">
        Browse all product categories and find the best deals.
      </p>

      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="grid grid-cols-4 gap-6">
        {categories
          .filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <CategoryCard
  key={item.title}
  icon={item.icon}
  title={item.title}
  description={item.description}
  onClick={() => setSelectedCategory(item.title)}
  isSelected={selectedCategory === item.title}
/>
          ))}
      </div>

      <div className="grid grid-cols-4 gap-6 mt-10">
        <StatsCard icon="📦" number="15K+" text="Products Tracked" />
        <StatsCard icon="🏪" number="25+" text="Stores Compared" />
        <StatsCard icon="🔔" number="5K+" text="Price Alerts Sent" />
        <StatsCard icon="💰" number="₹3.2L+" text="Money Saved" />
      </div>
    </div>
  );
}

export default CategorySection;