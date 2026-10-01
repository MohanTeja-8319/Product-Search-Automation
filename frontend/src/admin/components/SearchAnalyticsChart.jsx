import React, { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function SearchAnalyticsChart() {
  const [filter, setFilter] = useState("30D");

  const dataSets = {
    "7D": [
      { label: "Mon", value: 3120 },
      { label: "Tue", value: 3450 },
      { label: "Wed", value: 3980 },
      { label: "Thu", value: 4210 },
      { label: "Fri", value: 4680 },
      { label: "Sat", value: 5420 },
      { label: "Sun", value: 4890 },
    ],
    "30D": [
      { label: "Week 1", value: 18450 },
      { label: "Week 2", value: 21300 },
      { label: "Week 3", value: 24892 },
      { label: "Week 4", value: 27150 },
    ],
    "90D": [
      { label: "Month 1", value: 64200 },
      { label: "Month 2", value: 78500 },
      { label: "Month 3", value: 92400 },
    ],
    "1Y": [
      { label: "Q1", value: 198000 },
      { label: "Q2", value: 242000 },
      { label: "Q3", value: 289000 },
      { label: "Q4", value: 345000 },
    ],
  };

  const currentData = dataSets[filter];
  const maxValue = Math.max(...currentData.map((d) => d.value));
  const minValue = Math.min(...currentData.map((d) => d.value)) * 0.8;

  // Chart dimensions
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  // Generate SVG coordinates
  const points = currentData.map((d, index) => {
    const x = paddingX + (index / (currentData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.value - minValue) / (maxValue - minValue)) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #111111)",
        border: "1px solid var(--border, #222222)",
        borderRadius: "var(--radius-lg, 14px)",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {/* Header and Filter Buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 600, color: "var(--text-900, #f4efe8)", margin: 0 }}>
            Search Analytics
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--text-500, #888888)", margin: "2px 0 0" }}>
            Total user queries over time
          </p>
        </div>

        <div style={{ display: "flex", gap: 3, backgroundColor: "var(--surface-hover, #1a1a1a)", padding: 3, borderRadius: "var(--radius-full, 9999px)", border: "1px solid var(--border, #222222)" }}>
          {["7D", "30D", "90D", "1Y"].map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              style={{
                border: "none",
                borderRadius: "var(--radius-full, 9999px)",
                padding: "4px 10px",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: filter === period ? "var(--primary, #ffffff)" : "transparent",
                color: filter === period ? "var(--primary-content, #0a0a0a)" : "var(--text-500, #888888)",
                transition: "all 0.15s ease",
              }}
            >
              {period === "7D" ? "7D" : period === "30D" ? "30D" : period === "90D" ? "90D" : "1Y"}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ width: "100%", overflowX: "hidden" }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <linearGradient id="searchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--border, #222222)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--border, #222222)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--border, #222222)" strokeWidth="1" />

          {/* Filled Area */}
          <path d={areaD} fill="url(#searchGradient)" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="var(--surface, #111111)" stroke="#10b981" strokeWidth="2.5" />
              <text x={p.x} y={height - 4} fontSize="10.5" fill="var(--text-500, #888888)" textAnchor="middle" fontFamily="sans-serif">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Chart Footer with Summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--border, #222222)", marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontSize: 13, fontWeight: 700 }}>
          <TrendingUp size={16} />
          <span>+18.4% growth</span>
        </div>
        <span style={{ fontSize: 12, color: "var(--text-500, #888888)" }}>
          Latest peak: <strong>{maxValue.toLocaleString()} searches</strong>
        </span>
      </div>
    </div>
  );
}
