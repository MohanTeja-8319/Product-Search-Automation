import React, { useState, useRef } from "react";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiUpload, 
  FiTrash2, 
  FiChevronDown, 
  FiAlertTriangle,
  FiCheckCircle,
  FiX
} from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function Settings() {
  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Profile State
  const [profile, setProfile] = useState({
    fullName: "User",
    email: "user@email.com",
    phone: "+91 98765 43210",
    location: "New Delhi, India",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    currency: "INR (₹) - Indian Rupee",
    defaultStore: "Amazon",
    emailNotifications: true,
    smsNotifications: false,
  });

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  // Handle Input Changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (name, value) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  // Handle Avatar Change
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("File size exceeds 2MB limit!", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProfile(prev => ({ ...prev, avatar: uploadEvent.target.result }));
        showToast("Profile photo updated!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save
  const handleSaveChanges = (e) => {
    e.preventDefault();
    showToast("Profile settings saved successfully!", "success");
  };

  // Handle Account Deletion
  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    showToast("Account deletion request initiated.", "info");
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      <Sidebar />
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-4 md:p-8 flex-1">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Update your personal information and profile details.</p>
              </div>
              <button
                onClick={handleSaveChanges}
                type="button"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-100 transition-all duration-200 cursor-pointer"
              >
                Save Changes
              </button>
            </div>

            {/* Main Form Container */}
            <div className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
              
              {/* SECTION 1: PROFILE PICTURE & DETAILS */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Avatar Section */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-sky-100 border-4 border-white shadow-md flex items-center justify-center">
                      {profile.avatar ? (
                        <img 
                          src={profile.avatar} 
                          alt="Profile Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-12 h-12 text-indigo-400" />
                      )}
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload} 
                      accept="image/png, image/jpeg, image/webp" 
                      className="hidden" 
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-indigo-200 text-indigo-600 font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      <FiUpload className="w-3.5 h-3.5" />
                      Change Photo
                    </button>

                    <p className="text-[11px] text-gray-400 mt-3 text-center leading-relaxed">
                      JPG, PNG or WEBP.<br />Max size 2MB.
                    </p>
                  </div>

                  {/* Right Input Fields */}
                  <div className="md:col-span-8 space-y-5">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleProfileChange}
                          placeholder="Enter your full name"
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <FiUser className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          placeholder="user@email.com"
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <FiMail className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Phone & Location Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            placeholder="+91 98765 43210"
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <FiPhone className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            value={profile.location}
                            onChange={handleProfileChange}
                            placeholder="New Delhi, India"
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <FiMapPin className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* SECTION 2: PREFERENCES */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Preferences</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Set your app preferences.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Default Currency */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Default Currency
                    </label>
                    <div className="relative">
                      <select
                        value={preferences.currency}
                        onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="INR (₹) - Indian Rupee">INR (₹) - Indian Rupee</option>
                        <option value="USD ($) - US Dollar">USD ($) - US Dollar</option>
                        <option value="EUR (€) - Euro">EUR (€) - Euro</option>
                        <option value="GBP (£) - British Pound">GBP (£) - British Pound</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <FiChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Default Store */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Default Store
                    </label>
                    <div className="relative">
                      <select
                        value={preferences.defaultStore}
                        onChange={(e) => handlePreferenceChange('defaultStore', e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Amazon">Amazon</option>
                        <option value="Flipkart">Flipkart</option>
                        <option value="eBay">eBay</option>
                        <option value="Walmart">Walmart</option>
                        <option value="Best Buy">Best Buy</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <FiChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                    <div className="pr-4">
                      <span className="block text-sm font-semibold text-gray-800">Email Notifications</span>
                      <span className="block text-xs text-gray-500 mt-0.5">Receive updates on price drops and alerts.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.emailNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                    <div className="pr-4">
                      <span className="block text-sm font-semibold text-gray-800">SMS Notifications</span>
                      <span className="block text-xs text-gray-500 mt-0.5">Receive important alerts via SMS.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePreferenceChange('smsNotifications', !preferences.smsNotifications)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.smsNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* SECTION 3: DELETE ACCOUNT */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Delete Account</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and all your data.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  <FiTrash2 className="w-4 h-4 text-red-500" />
                  Delete Account
                </button>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
          <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-xl bg-white ${
            toast.type === "error" ? "border-red-200 text-red-800" : "border-indigo-200 text-indigo-900"
          }`}>
            <FiCheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span className="text-xs font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-auto text-gray-400 hover:text-gray-600">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Account Deletion</h3>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to delete your account? All your saved price alerts, browsing history, and preferences will be deleted.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
