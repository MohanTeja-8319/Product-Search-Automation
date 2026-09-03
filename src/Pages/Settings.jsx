import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FiX,
  FiLock,
  FiBell,
  FiSliders,
  FiShield,
  FiCheck,
  FiChevronRight,
  FiSave,
  FiSmartphone,
  FiGlobe,
  FiRefreshCw,
  FiCamera,
  FiStar,
  FiSmile,
  FiTag,
  FiAward,
} from "react-icons/fi";
import { FaStore, FaWhatsapp, FaKey, FaShieldAlt, FaDice, FaMagic } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

// Curated Avatar Collections
const AVATAR_COLLECTIONS = {
  characters: [
    { name: "Mohan", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mohan" },
    { name: "Alex", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex" },
    { name: "Zara", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Zara" },
    { name: "Leo", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo" },
    { name: "Maya", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maya" },
    { name: "Sam", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sam" },
    { name: "Luna", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna" },
    { name: "Kai", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Kai" },
  ],
  bots: [
    { name: "Spark", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Spark" },
    { name: "Byte", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Byte" },
    { name: "Bolt", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Bolt" },
    { name: "Neo", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Neo" },
    { name: "Pixel", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Pixel" },
    { name: "Titan", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Titan" },
  ],
  artistic: [
    { name: "Ava", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Ava" },
    { name: "Noah", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Noah" },
    { name: "Emma", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Emma" },
    { name: "Lucas", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Lucas" },
    { name: "Chloe", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Chloe" },
    { name: "Ryan", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Ryan" },
  ],
  photos: [
    {
      name: "Portrait 1",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    },
    {
      name: "Portrait 2",
      url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80",
    },
    {
      name: "Portrait 3",
      url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80",
    },
    {
      name: "Portrait 4",
      url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80",
    },
  ],
};

const ACCENT_RINGS = [
  { id: "indigo", name: "Electric Indigo", ring: "ring-4 ring-indigo-500", glow: "shadow-indigo-200" },
  { id: "purple", name: "Cyber Purple", ring: "ring-4 ring-purple-500", glow: "shadow-purple-200" },
  { id: "emerald", name: "Emerald Glow", ring: "ring-4 ring-emerald-500", glow: "shadow-emerald-200" },
  { id: "amber", name: "Sunset Amber", ring: "ring-4 ring-amber-500", glow: "shadow-amber-200" },
  { id: "cyan", name: "Neon Cyan", ring: "ring-4 ring-cyan-500", glow: "shadow-cyan-200" },
  { id: "rose", name: "Rose Pink", ring: "ring-4 ring-pink-500", glow: "shadow-pink-200" },
];

const BADGE_OPTIONS = [
  "✨ Verified Shopper",
  "💎 Deal Hunter Pro",
  "⚡ Flash Saver VIP",
  "🎯 Smart Buyer",
  "🏆 Price Master",
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarCategory, setAvatarCategory] = useState("characters"); // 'characters' | 'bots' | 'artistic' | 'photos'
  const [selectedRing, setSelectedRing] = useState("indigo");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          fullName: parsed.name || parsed.fullName || "Mohan Teja",
          email: parsed.email || "mohan.teja@gmail.com",
          phone: parsed.phone || "+91 98492 10834",
          location: parsed.location || "Bengaluru, Karnataka, India",
          avatar:
            parsed.avatar ||
            "https://api.dicebear.com/7.x/adventurer/svg?seed=Mohan",
          badge: parsed.badge || "✨ Verified Shopper",
          accentRing: parsed.accentRing || "indigo",
          provider: parsed.provider || "local",
        };
      }
    } catch {}
    return {
      fullName: "Mohan Teja",
      email: "mohan.teja@gmail.com",
      phone: "+91 98492 10834",
      location: "Bengaluru, Karnataka, India",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mohan",
      badge: "✨ Verified Shopper",
      accentRing: "indigo",
      provider: "local",
    };
  });

  // Shopping Preferences
  const [preferences, setPreferences] = useState({
    currency: "INR (₹) - Indian Rupee",
    defaultStore: "Amazon",
    defaultSort: "Lowest Price First",
    autoTrackViewed: true,
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailPriceDrops: true,
    pushPriceDrops: true,
    whatsappPriceDrops: false,
    dailyDigest: true,
    stockAlerts: true,
  });

  // Security State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  // Sync ring
  useEffect(() => {
    if (profile.accentRing) {
      setSelectedRing(profile.accentRing);
    }
  }, [profile.accentRing]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (name, value) => {
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name, value) => {
    setNotifications((prev) => ({ ...prev, [name]: value }));
  };

  // Avatar Selection
  const selectAvatar = (url) => {
    setProfile((prev) => ({ ...prev, avatar: url }));
    showToast("Profile avatar updated! Click Save to apply.", "success");
  };

  // Randomize Avatar Generator
  const generateRandomAvatar = () => {
    const styles = ["adventurer", "bottts", "lorelei", "fun-emoji", "avataaars"];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const newAvatarUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`;

    setProfile((prev) => ({ ...prev, avatar: newAvatarUrl }));
    showToast(`🎲 Generated unique "${randomStyle}" avatar!`, "success");
  };

  // Custom Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("File size exceeds 2MB limit!", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProfile((prev) => ({ ...prev, avatar: uploadEvent.target.result }));
        showToast("Custom photo uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings & Broadcast Live Update
  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    const updatedUser = {
      ...profile,
      name: profile.fullName,
      accentRing: selectedRing,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("user-profile-updated"));
    showToast("Profile & Avatar settings saved globally!", "success");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!securityForm.newPassword || !securityForm.confirmPassword) {
      showToast("Please provide your new password.", "error");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    showToast("Password updated successfully!", "success");
    setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("user-profile-updated"));
    showToast("Account deletion request initiated.", "error");
  };

  const currentRingStyle =
    ACCENT_RINGS.find((r) => r.id === selectedRing)?.ring || "ring-4 ring-indigo-500";

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 flex flex-col font-sans">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-6xl w-full mx-auto pb-28">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-indigo-600 font-semibold">Profile & Platform Settings</span>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-8 mb-8 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className={`rounded-2xl p-0.5 ${currentRingStyle} shadow-lg transition-all duration-300`}>
                    <img
                      src={profile.avatar}
                      alt={profile.fullName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix";
                      }}
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                    ✓
                  </span>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-[11px] font-bold mb-1.5">
                    {profile.badge}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {profile.fullName}
                  </h1>
                  <p className="text-slate-300 text-xs mt-0.5 font-medium">
                    {profile.email} · {profile.location}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={generateRandomAvatar}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 backdrop-blur-md cursor-pointer"
                  title="Randomize Avatar"
                >
                  <FaDice className="text-amber-400 text-sm animate-spin-slow" />
                  <span>Roll Magic Avatar</span>
                </button>

                <button
                  onClick={handleSaveChanges}
                  type="button"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <FiSave className="text-sm" />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 mb-8 shadow-sm overflow-x-auto scrollbar-hide">
            {[
              { id: "profile", label: "Profile & Avatar Studio", icon: FiUser },
              { id: "preferences", label: "Shopping Preferences", icon: FiSliders },
              { id: "notifications", label: "Alert Notifications", icon: FiBell },
              { id: "security", label: "Security & Access", icon: FiShield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Cards */}
          <div className="space-y-8">
            {/* ================= TAB 1: PROFILE & AVATAR STUDIO ================= */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-fadeIn">
                {/* 🌟 1. AVATAR STUDIO CARD */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-indigo-600 font-bold text-xs mb-1">
                        <FiStar />
                        <span>Interactive Avatar Studio</span>
                      </div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        Customize Your Persona & Badge
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Choose an illustrated 3D character, upload a photo, or generate a custom avatar
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={generateRandomAvatar}
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FaMagic className="text-xs text-indigo-600" />
                        <span>Random Generator</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <FiCamera className="text-xs" />
                        <span>Upload Photo</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Avatar Galleries with Category Switcher */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
                      {[
                        { id: "characters", label: "🎨 3D Characters" },
                        { id: "bots", label: "🤖 Cyber Bots" },
                        { id: "artistic", label: "🎭 Modern Humans" },
                        { id: "photos", label: "📸 Photographic" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setAvatarCategory(cat.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                            avatarCategory === cat.id
                              ? "bg-slate-900 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Avatars Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {AVATAR_COLLECTIONS[avatarCategory]?.map((av, idx) => {
                        const isSelected = profile.avatar === av.url;
                        return (
                          <div
                            key={idx}
                            onClick={() => selectAvatar(av.url)}
                            className={`group relative rounded-2xl p-1 border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 scale-105 shadow-md"
                                : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300"
                            }`}
                          >
                            <img
                              src={av.url}
                              alt={av.name}
                              className="w-12 h-12 rounded-xl object-cover bg-white"
                            />
                            <span className="text-[10px] font-bold text-slate-500 mt-1 truncate max-w-full">
                              {av.name}
                            </span>
                            {isSelected && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs">
                                <FiCheck className="stroke-[3]" />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 🎨 ACCENT RING & STATUS BADGE CUSTOMIZATION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    {/* Accent Rings */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                        Avatar Frame Accent:
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {ACCENT_RINGS.map((ring) => {
                          const isSelected = selectedRing === ring.id;
                          return (
                            <button
                              key={ring.id}
                              type="button"
                              onClick={() => setSelectedRing(ring.id)}
                              className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 font-bold text-indigo-700"
                                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full ${
                                  ring.id === "indigo"
                                    ? "bg-indigo-600"
                                    : ring.id === "purple"
                                    ? "bg-purple-600"
                                    : ring.id === "emerald"
                                    ? "bg-emerald-500"
                                    : ring.id === "amber"
                                    ? "bg-amber-500"
                                    : ring.id === "cyan"
                                    ? "bg-cyan-500"
                                    : "bg-pink-500"
                                }`}
                              ></div>
                              <span className="text-[10px] truncate max-w-full font-semibold">
                                {ring.name.split(" ")[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shopper Badge Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                        Shopper Profile Badge:
                      </label>
                      <div className="relative">
                        <select
                          name="badge"
                          value={profile.badge}
                          onChange={handleProfileChange}
                          className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                        >
                          {BADGE_OPTIONS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-4 top-3.5 text-slate-400 text-xs pointer-events-none" />
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1 font-medium">
                        Shown across comparisons, price alerts, and platform badges.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 📝 2. PERSONAL DETAILS CARD */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Personal Account Information
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Your identity and contact credentials
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleProfileChange}
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                        />
                        <FiUser className="absolute right-4 top-3.5 text-slate-400 text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                        />
                        <FiMail className="absolute right-4 top-3.5 text-slate-400 text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                          />
                          <FiPhone className="absolute right-4 top-3.5 text-slate-400 text-sm" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Location / Region
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            value={profile.location}
                            onChange={handleProfileChange}
                            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                          />
                          <FiMapPin className="absolute right-4 top-3.5 text-slate-400 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: PREFERENCES ================= */}
            {activeTab === "preferences" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Shopping & Store Preferences
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize preferred currency, priority stores, and search ranking
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Default Currency */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Default Currency
                    </label>
                    <div className="relative">
                      <select
                        value={preferences.currency}
                        onChange={(e) => handlePreferenceChange("currency", e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                      >
                        <option value="INR (₹) - Indian Rupee">INR (₹) - Indian Rupee</option>
                        <option value="USD ($) - US Dollar">USD ($) - US Dollar</option>
                        <option value="EUR (€) - Euro">EUR (€) - Euro</option>
                        <option value="GBP (£) - British Pound">GBP (£) - British Pound</option>
                      </select>
                      <FiChevronDown className="absolute right-4 top-3.5 text-slate-400 text-sm pointer-events-none" />
                    </div>
                  </div>

                  {/* Default Store */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Preferred Primary Retailer
                    </label>
                    <div className="relative">
                      <select
                        value={preferences.defaultStore}
                        onChange={(e) => handlePreferenceChange("defaultStore", e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                      >
                        <option value="Amazon">Amazon</option>
                        <option value="Flipkart">Flipkart</option>
                        <option value="Croma">Croma</option>
                        <option value="Apple Store">Apple Store</option>
                        <option value="Reliance Digital">Reliance Digital</option>
                      </select>
                      <FiChevronDown className="absolute right-4 top-3.5 text-slate-400 text-sm pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        Automatic History Tracking
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Log visited product comparisons for quick timeline access.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.autoTrackViewed}
                        onChange={(e) =>
                          handlePreferenceChange("autoTrackViewed", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: NOTIFICATIONS ================= */}
            {activeTab === "notifications" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Price Alerts & Channels
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure how and when you receive automated price drop alerts
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-base font-bold">
                        <FiMail />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-900">
                          Email Price Drops
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          To {profile.email}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailPriceDrops}
                      onChange={(e) =>
                        handleNotificationChange("emailPriceDrops", e.target.checked)
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Browser Push */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-base font-bold">
                        <FiBell />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-900">
                          Browser Push
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          Instant desktop & mobile popups
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushPriceDrops}
                      onChange={(e) =>
                        handleNotificationChange("pushPriceDrops", e.target.checked)
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-base font-bold">
                        <FaWhatsapp />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-900">
                          WhatsApp Alerts
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          Real-time flash deal pings
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.whatsappPriceDrops}
                      onChange={(e) =>
                        handleNotificationChange("whatsappPriceDrops", e.target.checked)
                      }
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Daily Digest */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-base font-bold">
                        <FiCheckCircle />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-900">
                          Daily Digest Summary
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          Morning portfolio recap
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.dailyDigest}
                      onChange={(e) =>
                        handleNotificationChange("dailyDigest", e.target.checked)
                      }
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 4: SECURITY ================= */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Change Password</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ensure your account remains safe with a strong passphrase
                    </p>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={securityForm.currentPassword}
                        onChange={(e) =>
                          setSecurityForm({ ...securityForm, currentPassword: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={securityForm.newPassword}
                          onChange={(e) =>
                            setSecurityForm({ ...securityForm, newPassword: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={securityForm.confirmPassword}
                          onChange={(e) =>
                            setSecurityForm({ ...securityForm, confirmPassword: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Delete Account */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Delete Account Permanently
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Erase all saved wishlists, historical price tracking data, and personal details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <FiTrash2 className="text-sm" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 text-xs font-bold animate-bounce backdrop-blur-md">
          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white">
            <FiCheck className="stroke-[3]" />
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-scaleUp">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <FiAlertTriangle className="text-xl" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Confirm Account Deletion
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Are you sure you want to permanently erase your profile? All saved alerts, comparison sets, and tracked items will be deleted immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow transition cursor-pointer"
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
