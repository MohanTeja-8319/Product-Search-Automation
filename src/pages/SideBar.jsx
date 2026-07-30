import {
  FaHome,
  FaSearch,
  FaThLarge,
  FaBell,
  FaHeart,
  FaBalanceScale,
  FaHistory,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaShoppingBag,
} from "react-icons/fa";
import { useState } from "react";

const menuItems = [
  { icon: <FaHome />, text: "Home", active: false },
  { icon: <FaSearch />, text: "Search Products", active: true },
  { icon: <FaThLarge />, text: "Categories", active: false },
  { icon: <FaBell />, text: "Price Alerts", active: false },
  { icon: <FaHeart />, text: "Wishlist", active: false },
  { icon: <FaBalanceScale />, text: "Comparison", active: false },
  { icon: <FaHistory />, text: "History", active: false },
  { icon: <FaCog />, text: "Settings", active: false },
  { icon: <FaQuestionCircle />, text: "Help & Support", active: false },
  { icon: <FaSignOutAlt />, text: "Logout", active: false },
];

const Sidebar = () => {
      const [activeItem, setActiveItem] = useState('Home');
    
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <FaShoppingBag className="text-white text-lg" />
          </div>

          <div>
            <h1 className="font-bold text-lg leading-none">
              PriceScout
            </h1>

            <p className="text-[10px] text-gray-500">
              Compare. Save. Get Notified.
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-3 flex-1">
        {menuItems.map((item) => {
          // 3. Check if the current item is the active one in state
          const isActive = activeItem === item.text;

          return (
            <button
              key={item.text}
              // 4. Update the state to the clicked item text on click
              onClick={() => setActiveItem(item.text)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm my-1 transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm font-medium'
                  : 'text-gray-600 hover:bg-purple-100 hover:text-purple-700'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.text}</span>
            </button>
            );
        })}
      </div>


    <div className="mx-4 mb-5 bg-[#F7F3FF] rounded-2xl p-4 border border-gray-200">

    <div className="flex justify-center mb-3">
        <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041888.png"
            alt="alert"
            className="w-14"
        />
    </div>

    <h3 className="text-sm font-semibold text-center">
        Never Miss a Deal!
    </h3>

    <p className="text-[11px] text-gray-500 text-center mt-2 leading-5">
        Get notified instantly when prices drop on your favourite products.
    </p>

    <button
        className="w-full mt-4 bg-purple-600 text-white rounded-lg py-2 text-xs font-medium hover:bg-purple-700"
    >
        Create Alert
    </button>

</div>
</div>
  );
};

export default Sidebar;