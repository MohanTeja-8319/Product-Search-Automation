import React from "react";

export default function ComparelyLogo({ collapsed = false, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Stylized Logo Mark: "C" + Shopping Cart + Comparison Bars */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(79, 70, 229, 0.35)",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized 'C' arc */}
          <path
            d="M 17 6.5 C 15.5 4.8 13.2 4 10.5 4 C 6.4 4 3.5 7.1 3.5 12 C 3.5 16.9 6.4 20 10.5 20 C 13.2 20 15.5 19.2 17 17.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Mint Comparison Bars embedded inside C */}
          <rect x="8.5" y="11" width="1.8" height="5" rx="0.9" fill="#10B981" />
          <rect x="11.5" y="8" width="1.8" height="8" rx="0.9" fill="#10B981" />
          <rect x="14.5" y="10" width="1.8" height="6" rx="0.9" fill="#D1FAE5" />
          {/* Small shopping cart handle accent */}
          <circle cx="17.5" cy="5.5" r="1.2" fill="#10B981" />
        </svg>
      </div>

      {!collapsed && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: light ? "#0F172A" : "#FFFFFF",
                lineHeight: 1.1,
              }}
            >
              Comparely
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 4,
                backgroundColor: "#10B981",
                color: "#FFFFFF",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Admin
            </span>
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 500,
              color: light ? "#64748B" : "#94A3B8",
              letterSpacing: "0.02em",
              marginTop: 2,
            }}
          >
            Compare • Choose • Save
          </span>
        </div>
      )}
    </div>
  );
}
