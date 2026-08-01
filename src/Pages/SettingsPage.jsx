import React, { useState } from "react";
import { FiUser, FiBell, FiLock, FiGlobe, FiCheck } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
  });
  const [notifications, setNotifications] = useState({
    priceDrops: true,
    weeklyDigest: false,
    newsletters: true,
    smsAlerts: false,
  });
  const [savedMessage, setSavedMessage] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = () => {
    setSavedMessage("Settings saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      <Sidebar />
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-6 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Settings</h1>
            <p className="text-gray-500 text-sm mb-8">Manage your profile, notification targets, and account preferences.</p>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[450px]">
              {/* Tab Navigation Left */}
              <div className="w-full md:w-64 border-r border-gray-100 bg-gray-50/50 p-4 space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-xs transition cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <FiUser className="text-base" /> Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-xs transition cursor-pointer ${
                    activeTab === "notifications"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <FiBell className="text-base" /> Notification Alerts
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-xs transition cursor-pointer ${
                    activeTab === "security"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <FiLock className="text-base" /> Privacy & Security
                </button>
              </div>

              {/* Tab Content Right */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Profile Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Phone Number</label>
                          <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Preferences</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">Price Drop Notifications</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Receive instant alerts when products in your watchlist drop in price.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.priceDrops}
                            onChange={() => handleNotificationChange("priceDrops")}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">SMS Alerts</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Deliver drop alerts via text messages directly to your phone.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.smsAlerts}
                            onChange={() => handleNotificationChange("smsAlerts")}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">Weekly Digest</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Get a weekly summary email of product trends and savings.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.weeklyDigest}
                            onChange={() => handleNotificationChange("weeklyDigest")}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Password & Security</h2>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Current Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">New Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-50 pt-6 mt-8 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 min-h-[20px]">
                    {savedMessage && (
                      <>
                        <FiCheck className="text-sm" /> {savedMessage}
                      </>
                    )}
                  </span>
                  <button
                    onClick={saveSettings}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
