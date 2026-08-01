import React, { useState } from "react";
import { FiShare2, FiTrash2, FiHeart, FiCheck, FiArrowRight } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const Wishlist = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "iPhone 15 (128GB)",
      category: "Smartphone",
      price: 69900,
      targetPrice: 60000,
      drop: "5.41%",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80",
      store: "Amazon",
      logoText: "a",
      logoBg: "bg-black text-white font-serif",
      lastUpdated: "2m ago"
    },
    {
      id: 2,
      name: "MacBook Air M2",
      category: "Laptop",
      price: 99990,
      targetPrice: 90000,
      drop: "4.10%",
      image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=300&q=80",
      store: "Flipkart",
      logoText: "f",
      logoBg: "bg-blue-600 text-yellow-400 font-extrabold",
      lastUpdated: "1h ago"
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      category: "Headphones",
      price: 29990,
      targetPrice: 28000,
      drop: "6.25%",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
      store: "Amazon",
      logoText: "a",
      logoBg: "bg-black text-white font-serif",
      lastUpdated: "3h ago"
    },
    {
      id: 4,
      name: "Samsung Galaxy S24",
      category: "Smartphone",
      price: 74999,
      targetPrice: 70000,
      drop: "3.20%",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80",
      store: "Amazon",
      logoText: "a",
      logoBg: "bg-black text-white font-serif",
      lastUpdated: "5h ago"
    },
    {
      id: 5,
      name: "OnePlus Nord 4",
      category: "Smartphone",
      price: 29999,
      targetPrice: 28000,
      drop: "4.48%",
      image: "https://images.unsplash.com/photo-1565849328678-9275afe5d766?w=300&q=80",
      store: "Flipkart",
      logoText: "f",
      logoBg: "bg-blue-600 text-yellow-400 font-extrabold",
      lastUpdated: "1d ago"
    },
    {
      id: 6,
      name: "boAt Airdopes 131",
      category: "Earbuds",
      price: 999,
      targetPrice: 850,
      drop: "2.80%",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80",
      store: "Croma",
      logoText: "croma",
      logoBg: "bg-teal-700 text-white text-[10px] font-sans tracking-tighter uppercase px-1 py-0.5 rounded",
      lastUpdated: "2d ago"
    }
  ]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const deleteItem = (id) => {
    const itemToDelete = items.find((i) => i.id === id);
    setItems(items.filter((i) => i.id !== id));
    setSelectedIds(selectedIds.filter((x) => x !== id));
    if (itemToDelete) {
      triggerToast(`Removed "${itemToDelete.name}" from your wishlist.`);
    }
  };

  const clearAll = () => {
    if (items.length === 0) return;
    setItems([]);
    setSelectedIds([]);
    triggerToast("Cleared all items from your wishlist.");
  };

  const shareWishlist = () => {
    if (items.length === 0) {
      triggerToast("Your wishlist is empty.");
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    triggerToast("Wishlist link copied to clipboard!");
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800 relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6 flex-1">
          <div className="space-y-6">
              {/* Header card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-950">Wishlist</h1>
                  <p className="text-gray-400 text-sm font-semibold mt-1">
                    Products you want to buy and keep track of.
                  </p>
                  <p className="text-xs text-indigo-600 font-extrabold mt-3 bg-indigo-50 px-2.5 py-1 rounded-full inline-block">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={shareWishlist}
                    className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-indigo-600 text-xs font-bold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer shadow-sm"
                  >
                    <FiShare2 className="text-sm" />
                    Share Wishlist
                  </button>

                  <button
                    onClick={clearAll}
                    disabled={items.length === 0}
                    className={`flex items-center gap-2 text-xs font-bold py-2.5 px-5 rounded-xl transition duration-200 cursor-pointer shadow-sm ${
                      items.length === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Wishlist Table Container */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {items.length === 0 ? (
                  <div className="p-16 text-center">
                    <span className="text-5xl block mb-4">❤️</span>
                    <h3 className="font-bold text-gray-950 text-lg mb-1">Your Wishlist is Empty</h3>
                    <p className="text-gray-400 text-sm">Products you add to your wishlist will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[10px] font-extrabold uppercase tracking-wider">
                          <th className="py-4 px-6 w-12 text-center">
                            <input
                              type="checkbox"
                              checked={items.length > 0 && selectedIds.length === items.length}
                              onChange={handleSelectAll}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                          </th>
                          <th className="py-4 px-4 font-semibold text-xs">Product</th>
                          <th className="py-4 px-4 font-semibold text-xs">Price</th>
                          <th className="py-4 px-4 font-semibold text-xs">Store</th>
                          <th className="py-4 px-4 font-semibold text-xs">Last Updated</th>
                          <th className="py-4 px-6 font-semibold text-xs text-center w-28">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100/60">
                        {items.map((item) => {
                          const isRowSelected = selectedIds.includes(item.id);
                          return (
                            <tr
                              key={item.id}
                              className={`hover:bg-gray-50/40 transition duration-150 ${
                                isRowSelected ? "bg-indigo-50/20" : ""
                              }`}
                            >
                              {/* Checkbox */}
                              <td className="py-4 px-6 text-center">
                                <input
                                  type="checkbox"
                                  checked={isRowSelected}
                                  onChange={() => handleSelectRow(item.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                              </td>

                              {/* Product Info */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center justify-center shrink-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="max-h-full max-w-full object-contain rounded-lg"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-xs text-gray-900 leading-snug">
                                      {item.name}
                                    </h4>
                                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                                      {item.category}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Price */}
                              <td className="py-4 px-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-xs text-gray-950">
                                      ₹{item.price.toLocaleString()}
                                    </span>
                                    <span className="flex items-center text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                      ↓ {item.drop}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-semibold">
                                    Target: ₹{item.targetPrice.toLocaleString()}
                                  </div>
                                </div>
                              </td>

                              {/* Store */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-0.5 text-[9px] font-black rounded uppercase select-none ${item.logoBg}`}
                                  >
                                    {item.logoText}
                                  </span>
                                  <span className="text-xs font-semibold text-gray-600">{item.store}</span>
                                </div>
                              </td>

                              {/* Last Updated */}
                              <td className="py-4 px-4 text-xs font-semibold text-gray-500">
                                {item.lastUpdated}
                              </td>

                              {/* Action */}
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={() => triggerToast(`Item "${item.name}" is already saved to favorites.`)}
                                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-1.5 rounded-lg transition duration-200 cursor-pointer"
                                  >
                                    <FaHeart className="text-sm" />
                                  </button>
                                  <button
                                    onClick={() => deleteItem(item.id)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition duration-200 cursor-pointer"
                                  >
                                    <FiTrash2 className="text-sm" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Bottom Feature Promo banner */}
              <div className="bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-blue-50/50 border border-indigo-100/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
                    <FiHeart className="text-base fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 leading-snug">
                      Save products you love and get notified when prices drop.
                    </h4>
                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                      Never miss a deal on your favorite items.
                    </p>
                  </div>
                </div>

                <a
                  href="#learn-more"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerToast("Redirecting to information center...");
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                >
                  Learn More
                  <FiArrowRight className="text-sm" />
                </a>
              </div>
            </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-800 text-xs font-bold transition duration-300 z-50 animate-bounce">
          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white shrink-0">
            <FiCheck className="stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
