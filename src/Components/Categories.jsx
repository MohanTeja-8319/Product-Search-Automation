import React from "react";
import {
  FaLaptop,
  FaMobileAlt,
  FaHeadphones,
  FaTv,
  FaCamera,
  FaGamepad,
  FaClock,
  FaTabletAlt,
} from "react-icons/fa";

const categories = [
  { name: "Laptops", icon: <FaLaptop />, color: "bg-indigo-500" },
  { name: "Mobiles", icon: <FaMobileAlt />, color: "bg-blue-500" },
  { name: "Headphones", icon: <FaHeadphones />, color: "bg-pink-500" },
  { name: "Televisions", icon: <FaTv />, color: "bg-green-500" },
  { name: "Cameras", icon: <FaCamera />, color: "bg-yellow-500" },
  { name: "Gaming", icon: <FaGamepad />, color: "bg-red-500" },
  { name: "Smart Watches", icon: <FaClock />, color: "bg-purple-500" },
  { name: "Tablets", icon: <FaTabletAlt />, color: "bg-orange-500" },
];

const Categories = () => {
  return (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Shop by Categories
        </h2>

        <button className="text-indigo-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-6">

        {categories.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 flex flex-col items-center cursor-pointer group"
          >
            <div
              className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl group-hover:scale-110 transition`}
            >
              {item.icon}
            </div>

            <h3 className="mt-4 font-semibold text-gray-700 text-center">
              {item.name}
            </h3>
          </div>
        ))}

      </div>
    </section>
  );
};

export default Categories;