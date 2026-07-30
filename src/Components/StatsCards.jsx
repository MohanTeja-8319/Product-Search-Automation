import React from "react";
import {
  FaShoppingCart,
  FaSearchDollar,
  FaTags,
  FaUsers,
  FaArrowUp,
} from "react-icons/fa";

const stats = [
  {
    title: "Products Compared",
    value: "12,548",
    change: "+18%",
    icon: <FaShoppingCart className="text-3xl text-white" />,
    bg: "from-indigo-500 to-blue-600",
  },
  {
    title: "Today's Searches",
    value: "4,862",
    change: "+12%",
    icon: <FaSearchDollar className="text-3xl text-white" />,
    bg: "from-green-500 to-emerald-600",
  },
  {
    title: "Best Deals Found",
    value: "2,145",
    change: "+24%",
    icon: <FaTags className="text-3xl text-white" />,
    bg: "from-pink-500 to-rose-600",
  },
  {
    title: "Active Users",
    value: "18,450",
    change: "+9%",
    icon: <FaUsers className="text-3xl text-white" />,
    bg: "from-orange-500 to-yellow-500",
  },
];

const StatsCards = () => {
  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>

                <h2 className="text-3xl font-bold mt-2">{item.value}</h2>

                <div className="flex items-center gap-2 mt-3 text-green-600">
                  <FaArrowUp />
                  <span className="font-semibold">{item.change}</span>
                  <span className="text-gray-400 text-sm">this month</span>
                </div>
              </div>

              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.bg} flex justify-center items-center shadow-lg`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCards;