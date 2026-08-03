import React, { useEffect, useState } from "react";
import {
  FiBell,
  FiChevronRight,
  FiRefreshCw,
  FiTarget,
  FiShoppingBag,
  FiSliders,
} from "react-icons/fi";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: FiRefreshCw,
    title: "Real-time Alerts",
    subtitle: "Instant notifications on price drops",
  },
  {
    icon: FiTarget,
    title: "Custom Targets",
    subtitle: "Set your target price",
  },
  {
    icon: FiShoppingBag,
    title: "Multiple Stores",
    subtitle: "Track from top websites",
  },
  {
    icon: FiSliders,
    title: "Easy Management",
    subtitle: "Create, edit & manage alerts",
  },
];

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  const navigate=useNavigate()

  useEffect(() => {
    const savedAlerts =
      JSON.parse(localStorage.getItem("priceAlerts")) || [];

    setAlerts(savedAlerts);
  }, []);

  const activeAlerts = alerts.filter((alert) => alert.active);

  const triggeredAlerts = alerts.filter((alert) => !alert.active);

  const renderAlertRow = (alert) => {
    const expectedDrop = alert.currentPrice - alert.targetPrice;

    const percentage = (
      (expectedDrop / alert.currentPrice) *
      100
    ).toFixed(2);

    return (
      <div
        key={alert.id}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={alert.image}
              alt={alert.productName}
              className="w-16 h-16 object-contain rounded-xl bg-gray-50 p-1.5"
            />

            <div>
              <h3 className="font-bold text-sm text-gray-950">
                {alert.productName}
              </h3>

              <p className="text-xs text-gray-400 font-semibold mt-1">
                Target: ₹{alert.targetPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                Current
              </p>

              <p className="font-extrabold text-sm text-gray-950 mt-0.5">
                ₹{alert.currentPrice.toLocaleString()}
              </p>
            </div>

            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full whitespace-nowrap">
              ↓ {percentage}%
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={alert.active}
                readOnly
                className="sr-only peer"
              />

              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 transition"></div>

              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-6 flex-1">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-950">
                  Price Alerts
                </h1>

                <p className="text-gray-400 text-sm font-semibold mt-1">
                  Stay updated with price drops on products you care about.
                </p>
              </div>

              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 px-5 rounded-xl transition duration-200 cursor-pointer shadow-sm "
              onClick={()=>navigate("/createalerts")}>
                <FiBell className="text-sm" />
                Create New Alert
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-100">
              <button
                onClick={() => setActiveTab("active")}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === "active"
                    ? "text-indigo-600 border-indigo-600"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                Active Alerts ({activeAlerts.length})
              </button>

              <button
                onClick={() => setActiveTab("triggered")}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === "triggered"
                    ? "text-indigo-600 border-indigo-600"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                Triggered ({triggeredAlerts.length})
              </button>
            </div>

            {/* Alert List */}
            <div className="space-y-4">
              {activeTab === "active" ? (
                activeAlerts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
                      <FiBell className="text-3xl text-indigo-600" />
                    </div>

                    <h2 className="text-lg font-bold text-gray-950 mt-5">
                      No Active Alerts
                    </h2>

                    <p className="text-gray-400 text-sm font-semibold mt-2">
                      Create your first price alert.
                    </p>
                  </div>
                ) : (
                  activeAlerts.map(renderAlertRow)
                )
              ) : triggeredAlerts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
                    <FiBell className="text-3xl text-indigo-600" />
                  </div>

                  <h2 className="text-lg font-bold text-gray-950 mt-5">
                    No Triggered Alerts
                  </h2>

                  <p className="text-gray-400 text-sm font-semibold mt-2">
                    Triggered alerts will show up here.
                  </p>
                </div>
              ) : (
                triggeredAlerts.map(renderAlertRow)
              )}
            </div>
            {/* How Price Alerts Work */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <FiBell className="text-blue-700 text-lg" />
                </div>

                <div>
                  <h4 className="font-bold text-sm text-gray-950">
                    How Price Alerts Work?
                  </h4>

                  <p className="text-xs text-gray-400 font-semibold mt-1">
                    We'll notify you instantly when the price drops below your
                    target price.
                  </p>
                </div>
              </div>

              <a
                href="#learn-more"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition shrink-0"
              >
                Learn More
                <FiChevronRight className="text-sm" />
              </a>
            </div>

            {/* Feature Strip */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Icon className="text-blue-700 text-lg" />
                    </div>

                    <div>
                      <h5 className="font-bold text-xs text-gray-950">
                        {feature.title}
                      </h5>

                      <p className="text-[11px] text-gray-400 font-semibold mt-1 leading-snug">
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PriceAlerts;