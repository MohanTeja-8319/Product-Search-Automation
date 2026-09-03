import React from "react";
import dummyProducts from "../data/products";

const Specifications = ({ product }) => {
  if (!product) return null;

  // Lookup matched product in dummyProducts for full meta details
  const matched = dummyProducts.find(
    (p) =>
      p.name.toLowerCase() === (product.name || "").toLowerCase() ||
      (product.name || "").toLowerCase().includes(p.name.toLowerCase())
  );

  const brand = product.brand || (matched ? matched.brand : "Apple");
  const category = product.category || (matched ? matched.category : "Smartphones");
  const originalPrice =
    product.originalPrice || (matched ? matched.originalPrice : Math.round(product.price * 1.12));
  const reviews =
    product.reviews || (matched ? matched.reviews : 4230);

  const isPhone = category.toLowerCase().includes("phone") || (product.name || "").toLowerCase().includes("iphone") || (product.name || "").toLowerCase().includes("galaxy");
  const isLaptop = category.toLowerCase().includes("laptop") || (product.name || "").toLowerCase().includes("macbook") || (product.name || "").toLowerCase().includes("dell");

  const specs = [
    { label: "Brand", value: brand },
    { label: "Category", value: category },
    { label: "Model Name", value: product.name || "Flagship Edition" },
    {
      label: "Display & Screen",
      value: isPhone
        ? "6.1-inch Super Retina XDR OLED (2000 nits Peak)"
        : isLaptop
        ? "13.6-inch Liquid Retina True Tone Display"
        : "Dynamic High-Resolution Acoustic Drivers",
    },
    {
      label: "Processor / Chipset",
      value: isPhone
        ? "Next-Gen 3nm High Efficiency Processor"
        : isLaptop
        ? "M4 / Core Ultra High Performance Multi-Core"
        : "HD Noise Cancelling Processor",
    },
    {
      label: "Battery & Charging",
      value: isPhone
        ? "All-day battery life (Fast Wireless MagSafe)"
        : isLaptop
        ? "Up to 18 hours battery life (MagSafe 3)"
        : "Up to 30 hours continuous playback",
    },
    { label: "Customer Rating", value: `⭐ ${product.rating || "4.8"} / 5.0` },
    { label: "Store Availability", value: product.availability || "In Stock (Verified Authorized Seller)" },
    {
      label: "Retail Price",
      value: `₹${product.price.toLocaleString()} (Best Deal)`,
    },
    { label: "MRP (Original)", value: `₹${originalPrice.toLocaleString()}` },
    { label: "Instant Savings", value: product.discount || "8% OFF" },
    { label: "Verified Buyer Reviews", value: `${reviews.toLocaleString()} global ratings` },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl mt-6 overflow-hidden shadow-sm">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Key Technical Specifications
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-0.5">
          Detailed hardware, performance, and seller specifications
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] text-left border-collapse">
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold">
            {specs.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white hover:bg-slate-50/60 transition" : "bg-slate-50/30 hover:bg-slate-50/60 transition"}
              >
                <td className="w-1/3 px-4 sm:px-6 py-3 sm:py-3.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                  {item.label}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-3.5 text-slate-800 font-medium">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Specifications;