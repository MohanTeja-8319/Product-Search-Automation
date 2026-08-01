import React from "react";
import { FiShoppingBag, FiTag, FiBell } from "react-icons/fi";
import { FaPiggyBank } from "react-icons/fa";

const StatsCards = () => {
  const stats = [
    {
      value: "25+",
      label: "Stores Compared",
      icon: <FiShoppingBag className="text-xl text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      value: "15K+",
      label: "Products Tracked",
      icon: <FiTag className="text-xl text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      value: "5K+",
      label: "Price Alerts Sent",
      icon: <FiBell className="text-xl text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      value: "₹3.2L+",
      label: "Money Saved by Users",
      icon: <FaPiggyBank className="text-xl text-amber-600" />,
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 leading-none">{item.value}</h3>
              <p className="text-xs font-semibold text-gray-400 mt-1 leading-none">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCards;