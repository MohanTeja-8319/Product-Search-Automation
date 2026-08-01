import React from "react";
import { FaTag, FaSync, FaBell, FaShieldAlt } from "react-icons/fa";

const FeaturesBar = () => {
  const features = [
    {
      icon: <FaTag className="text-indigo-600 text-lg" />,
      title: "Best Prices",
      desc: "We compare, you save more.",
    },
    {
      icon: <FaSync className="text-indigo-600 text-lg" />,
      title: "Real-time Updates",
      desc: "Prices updated in real-time.",
    },
    {
      icon: <FaBell className="text-indigo-600 text-lg" />,
      title: "Price Drop Alerts",
      desc: "Get notified on every drop.",
    },
    {
      icon: <FaShieldAlt className="text-indigo-600 text-lg" />,
      title: "Safe & Reliable",
      desc: "100% secure and reliable.",
    },
  ];

  return (
    <div className="w-full bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-4 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {features.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 px-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBar;
