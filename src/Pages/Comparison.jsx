import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiTrash2, FiPlus, FiX, FiCheck, FiInfo, FiSearch } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { BiGitCompare } from "react-icons/bi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import dummyProducts from "../data/products.js";

const Comparison = () => {
  // Pre-load the 4 default products shown in the screenshot layout
  // (replacing the boAt Wave Sigma 3 smartwatch with OnePlus Nord 4 to keep it watch-free)
  const [compareList, setCompareList] = useState([
    {
      id: 101,
      name: "iPhone 15 (128GB)",
      brand: "Apple",
      price: 69900,
      mrp: 73900,
      drop: "5.41%",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80",
      store: "Amazon",
      logoText: "a",
      logoBg: "bg-black text-white font-serif",
      display: "6.1 inch Super Retina XDR",
      processor: "A16 Bionic chip",
      ram: "-",
      storage: "128GB",
      battery: "3349 mAh",
      camera: "48MP + 12MP",
      rating: 4.6,
      reviews: 2340,
      addedOn: "2 May 2024"
    },
    {
      id: 102,
      name: "Dell Inspiron 15",
      brand: "Dell",
      price: 45990,
      mrp: 47999,
      drop: "3.16%",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80",
      store: "Flipkart",
      logoText: "f",
      logoBg: "bg-blue-600 text-yellow-400 font-extrabold",
      display: "15.6 inch FHD",
      processor: "12th Gen Intel Core i5",
      ram: "8GB",
      storage: "512GB SSD",
      battery: "41Wh",
      camera: "-",
      rating: 4.3,
      reviews: 1230,
      addedOn: "1 May 2024"
    },
    {
      id: 103,
      name: "Sony WH-1000XM5",
      brand: "Sony",
      price: 29990,
      mrp: 31999,
      drop: "6.25%",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
      store: "Amazon",
      logoText: "a",
      logoBg: "bg-black text-white font-serif",
      display: "-",
      processor: "-",
      ram: "-",
      storage: "-",
      battery: "30 Hours",
      camera: "-",
      rating: 4.5,
      reviews: 3421,
      addedOn: "3 May 2024"
    },
    {
      id: 104,
      name: "OnePlus Nord 4",
      brand: "OnePlus",
      price: 29999,
      mrp: 31999,
      drop: "4.48%",
      image: "https://images.unsplash.com/photo-1565849328678-9275afe5d766?w=300&q=80",
      store: "Flipkart",
      logoText: "f",
      logoBg: "bg-blue-600 text-yellow-400 font-extrabold",
      display: "6.74 inch 1.5K AMOLED",
      processor: "Snapdragon 7+ Gen 3",
      ram: "12GB",
      storage: "256GB",
      battery: "5500 mAh",
      camera: "50MP + 8MP",
      rating: 4.4,
      reviews: 890,
      addedOn: "4 May 2024"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddModal]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  const removeProduct = (id) => {
    const item = compareList.find((p) => p.id === id);
    setCompareList(compareList.filter((p) => p.id !== id));
    if (item) {
      triggerToast(`Removed "${item.name}" from comparison.`);
    }
  };

  const clearAll = () => {
    if (compareList.length === 0) return;
    setCompareList([]);
    triggerToast("Cleared comparison list.");
  };

  const addProductToList = (product) => {
    if (compareList.length >= 4) {
      triggerToast("You can compare a maximum of 4 products.");
      setShowAddModal(false);
      setSearchQuery("");
      return;
    }
    if (compareList.some((p) => p.name === product.name)) {
      triggerToast("This product is already in the comparison list.");
      return;
    }

    // Format dummyProducts to include necessary spec fields for comparison view
    const brand = product.brand;
    const isApple = brand.toLowerCase().includes("apple");
    const isSamsung = brand.toLowerCase().includes("samsung");
    const isNothing = brand.toLowerCase().includes("nothing");
    const isPixel = product.name.toLowerCase().includes("pixel");
    const isOnePlus = brand.toLowerCase().includes("oneplus");

    let display = "6.5 inch AMOLED 120Hz";
    let processor = "Octa-Core Processor";
    let ram = "8GB";
    let storage = "128GB";
    let battery = "5000 mAh";
    let camera = "50MP + 8MP";

    if (isApple) {
      display = "6.1 inch Super Retina XDR";
      processor = "A18 Bionic chip";
      ram = "8GB";
      storage = "128GB";
      battery = "3561 mAh";
      camera = "48MP + 12MP";
    } else if (isSamsung) {
      display = "6.2 inch Dynamic AMOLED 2X";
      processor = "Snapdragon 8 Gen 3";
      ram = "12GB";
      storage = "256GB";
      battery = "4000 mAh";
      camera = "50MP + 10MP + 12MP";
    } else if (isPixel) {
      display = "6.3 inch Actua OLED";
      processor = "Google Tensor G4";
      ram = "12GB";
      storage = "128GB";
      battery = "4700 mAh";
      camera = "50MP + 48MP";
    } else if (isNothing) {
      display = "6.7 inch Flexible AMOLED";
      processor = "Dimensity 7200 Pro";
      ram = "8GB";
      storage = "128GB";
      battery = "5000 mAh";
      camera = "50MP + 50MP";
    } else if (isOnePlus) {
      display = "6.74 inch 1.5K AMOLED";
      processor = "Snapdragon 7+ Gen 3";
      ram = "12GB";
      storage = "256GB";
      battery = "5500 mAh";
      camera = "50MP + 8MP";
    }

    const newProduct = {
      id: Date.now(),
      name: product.name,
      brand: product.brand,
      price: product.price,
      mrp: product.originalPrice,
      drop: product.discount,
      image: product.image,
      store: product.store,
      logoText: product.store === "Amazon" ? "a" : product.store === "Flipkart" ? "f" : "croma",
      logoBg: product.store === "Amazon" ? "bg-black text-white font-serif" : product.store === "Flipkart" ? "bg-blue-600 text-yellow-400 font-extrabold" : "bg-teal-700 text-white text-[10px]",
      display,
      processor,
      ram,
      storage,
      battery,
      camera,
      rating: product.rating,
      reviews: product.reviews,
      addedOn: "Today"
    };

    setCompareList([...compareList, newProduct]);
    triggerToast(`Added "${product.name}" to comparison.`);
    setShowAddModal(false);
    setSearchQuery("");
  };

  // Helper to fill slots up to 4
  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < 4; i++) {
      slots.push(compareList[i] || null);
    }
    return slots;
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
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-950">Comparison</h1>
                  <p className="text-gray-400 text-sm font-semibold mt-1">
                    Compare up to 4 products side by side.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer shadow-sm"
                  >
                    <FiTrash2 className="text-sm" />
                    Clear All
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer shadow-sm"
                    >
                      <FiPlus className="text-sm" />
                      Add Product
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Comparison Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {renderSlots().map((product, index) => {
                  if (product) {
                    return (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative group"
                      >
                        {/* Close button */}
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-gray-50 p-1.5 rounded-lg transition z-10 cursor-pointer"
                        >
                          <FiX className="text-xs" />
                        </button>

                        {/* Product Image */}
                        <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-4 p-3 select-none">
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300";
                            }}
                            className="max-h-full max-w-full object-contain group-hover:scale-102 transition duration-200"
                          />
                        </div>

                        {/* Info details */}
                        <div className="text-center space-y-1 mb-4">
                          <h3 className="font-bold text-xs text-gray-900 leading-snug line-clamp-2 h-8 px-1">
                            {product.name}
                          </h3>
                          <div className="font-extrabold text-sm text-gray-950">
                            ₹{product.price.toLocaleString()}
                          </div>
                          <div className="flex items-center justify-center gap-1.5 mt-1">
                            <span
                              className={`px-1.5 py-0.5 text-[8px] font-black rounded uppercase select-none ${product.logoBg}`}
                            >
                              {product.logoText}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500">{product.store}</span>
                          </div>
                        </div>

                        {/* View Deal Button */}
                        <button
                          onClick={() => triggerToast(`Navigating to ${product.store} to view this offer...`)}
                          className="w-full border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/10 text-indigo-600 text-xs font-bold py-2 px-3 rounded-xl transition duration-200 cursor-pointer"
                        >
                          View Deal
                        </button>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={`empty-${index}`}
                        onClick={() => setShowAddModal(true)}
                        className="bg-white border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/40 hover:border-indigo-300 transition duration-300 min-h-[250px] select-none group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition mb-3">
                          <FiPlus className="text-lg" />
                        </div>
                        <h4 className="text-xs font-bold text-gray-700">Add Product</h4>
                        <p className="text-[10px] text-gray-400 mt-1 max-w-[120px]">
                          Choose a smartphone model to compare
                        </p>
                      </div>
                    );
                  }
                })}
              </div>

              {/* Comparison Spec Matrix Table */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-fixed min-w-[650px]">
                    <thead>
                      <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="py-3.5 px-5 w-[160px] font-semibold text-xs">Features</th>
                        {renderSlots().map((p, idx) => (
                          <th key={idx} className="py-3.5 px-4 font-semibold text-xs">
                            {p ? p.brand : `Product ${idx + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/60 text-xs font-semibold text-gray-700">
                      {/* Store */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Store</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-900">
                            {p ? p.store : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* Current Price */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Current Price</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-950 font-extrabold">
                            {p ? `₹${p.price.toLocaleString()}` : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* Price Change */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Price Change</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4">
                            {p ? (
                              <span className="text-green-600 font-extrabold">↓ {p.drop}</span>
                            ) : (
                              <span className="text-gray-300 font-normal italic">-</span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* MRP */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">MRP</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-400 line-through">
                            {p ? `₹${p.mrp.toLocaleString()}` : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* Display */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Display</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-600 font-medium">
                            {p ? p.display : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* Processor */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Processor</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-600 font-medium">
                            {p ? p.processor : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* RAM */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">RAM</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-600 font-medium">
                            {p ? p.ram : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* Storage */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Storage</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-600 font-medium">
                            {p ? p.storage : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* Battery */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Battery</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-600 font-medium">
                            {p ? p.battery : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* Main Camera */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Main Camera</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-600 font-medium">
                            {p ? p.camera : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>

                      {/* Rating */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Rating</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4">
                            {p ? (
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400 text-xs mb-0.5" />
                                <span className="font-extrabold text-gray-900">{p.rating}</span>
                                <span className="text-[10px] text-gray-400">({p.reviews.toLocaleString()})</span>
                              </div>
                            ) : (
                              <span className="text-gray-300 font-normal italic">-</span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Added On */}
                      <tr>
                        <td className="py-3 px-5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">Added On</td>
                        {renderSlots().map((p, idx) => (
                          <td key={idx} className="py-3 px-4 text-gray-500 font-medium">
                            {p ? p.addedOn : <span className="text-gray-300 font-normal italic">-</span>}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Notification Banner */}
              <div className="bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-blue-50/50 border border-indigo-100/40 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
                    <BiGitCompare className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 leading-snug">
                      Comparing prices, specs and more helps you choose the best deal.
                    </h4>
                  </div>
                </div>

                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerToast("Comparison engine helper is initializing...");
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                >
                  How it works
                  <span className="text-sm font-semibold">&gt;</span>
                </a>
              </div>
            </div>
        </main>
      </div>

      {/* Add Product Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Add Smartphone to Compare</h3>
                <p className="text-gray-400 text-xs font-semibold mt-1">Select a model to add to comparison slots</p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery("");
                }}
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-xl transition cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Modal Search Input */}
            <div className="p-6 pb-4 border-b border-gray-50 bg-gray-50/50">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, brand, or store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal Content / Scrollable List */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] p-6 space-y-3">
              {dummyProducts
                .filter((p) => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    p.name.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query) ||
                    p.store.toLowerCase().includes(query)
                  );
                })
                .map((p) => {
                  const isAlreadyAdded = compareList.some((c) => c.name === p.name);
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-2xl transition duration-150 border ${
                        isAlreadyAdded ? "border-indigo-100/50 bg-indigo-50/10" : "border-gray-100/60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center justify-center shrink-0 shadow-sm">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100";
                            }}
                            className="max-h-full max-w-full object-contain rounded-md"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-gray-900 truncate">{p.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {p.brand}
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold">₹{p.price.toLocaleString()}</span>
                            <span className="text-[9px] text-gray-400 font-semibold">• {p.store}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => addProductToList(p)}
                        disabled={isAlreadyAdded}
                        className={`text-xs font-extrabold py-2 px-4 rounded-xl transition duration-150 cursor-pointer ${
                          isAlreadyAdded
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                        }`}
                      >
                        {isAlreadyAdded ? "Added" : "Add"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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

export default Comparison;
