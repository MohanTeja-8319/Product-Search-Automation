import React from "react";

export function SkeletonBox({ width = "100%", height = 20, radius = 8, style = {} }) {
  return (
    <div
      className="adm-skeleton"
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

export default function LoadingSkeleton({ type = "table", rows = 5 }) {
  if (type === "card") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 16,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <SkeletonBox width={90} height={14} />
              <SkeletonBox width={36} height={36} radius={10} />
            </div>
            <SkeletonBox width={120} height={28} />
          </div>
        ))}
      </div>
    );
  }

  // Default table skeleton
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 16,
        padding: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <SkeletonBox width={220} height={36} radius={8} />
        <SkeletonBox width={100} height={36} radius={8} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 0",
              borderBottom: i !== rows - 1 ? "1px solid #F1F5F9" : "none",
            }}
          >
            <SkeletonBox width={36} height={36} radius={8} />
            <SkeletonBox width="30%" height={16} />
            <SkeletonBox width="20%" height={16} />
            <SkeletonBox width="15%" height={16} />
            <SkeletonBox width="15%" height={16} />
            <SkeletonBox width={60} height={24} radius={9999} />
          </div>
        ))}
      </div>
    </div>
  );
}
