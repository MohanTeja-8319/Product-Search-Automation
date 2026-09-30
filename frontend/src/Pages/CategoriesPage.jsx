import React, { useState } from "react";
import { searchLiveProducts } from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiSmartphone, FiMonitor, FiHeadphones, FiWatch,
  FiCamera, FiTv, FiGrid, FiArrowRight
} from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const CATEGORIES = [
  {
    name: "Smartphones",
    searchKey: "Smartphones",
    icon: <FiSmartphone />,
    desc: "Compare flagships, 5G smartphones & budget champions."
  },
  {
    name: "Laptops",
    searchKey: "Laptops",
    icon: <FiMonitor />,
    desc: "MacBooks, ultrabooks, gaming laptops & everyday machines."
  },
  {
    name: "Headphones",
    searchKey: "Headphones",
    icon: <FiHeadphones />,
    desc: "True wireless earbuds, over-ear ANC, and audiophile gear."
  },
  {
    name: "Smartwatches",
    searchKey: "Smartwatches",
    icon: <FiWatch />,
    desc: "Fitness trackers, Apple Watches & Wear OS devices."
  },
  {
    name: "Televisions",
    searchKey: "Televisions",
    icon: <FiTv />,
    desc: "4K OLEDs, QLEDs, and budget smart TVs for every home."
  },
  {
    name: "Gaming",
    searchKey: "Gaming Consoles",
    icon: <FaGamepad />,
    desc: "PlayStation, Xbox, Nintendo Switch and accessories."
  }
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">
          
          {}
          <div style={{ marginBottom: 40, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px",
              background: "transparent", border: "1px solid var(--text-300)", color: "var(--text-900)",
              borderRadius: "var(--radius-full)", fontSize: 13, fontWeight: 600, marginBottom: 16
            }}>
              <FiGrid size={14} /> Shop by Category
            </div>
            <h1 className="font-heading" style={{ fontSize: 40, fontWeight: 400, color: "var(--text-900)", marginBottom: 12 }}>
              Explore All Categories
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-500)", maxWidth: 500, margin: "0 auto" }}>
              Find exactly what you're looking for. We track prices across thousands of products in these categories.
            </p>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, paddingBottom: 40 }}>
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="card-hover" onClick={() => navigate(`/search?q=${encodeURIComponent(cat.searchKey)}`)}
                style={{
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  padding: 32, textAlign: "center",
                  border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                  background: "transparent", transition: "var(--transition)"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-900)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  border: "1px solid var(--text-900)", color: "var(--text-900)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  margin: "0 auto 20px"
                }}>
                  {cat.icon}
                </div>
                
                <h3 className="font-heading" style={{ fontSize: 24, fontWeight: 400, color: "var(--text-900)", marginBottom: 8 }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-500)", lineHeight: 1.6, flex: 1, marginBottom: 24 }}>
                  {cat.desc}
                </p>

                <button className="btn btn-outline btn-full" style={{ borderRadius: "var(--radius-full)" }}>
                  <FiSearch size={14} /> Search {cat.name}
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
