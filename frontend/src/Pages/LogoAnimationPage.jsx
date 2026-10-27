import React, { useState } from "react";
import { Link } from "react-router-dom";
import ComparelyLogoAnimation from "../Components/ComparelyLogoAnimation";
import { FiArrowLeft, FiPlay, FiDownload, FiCheckCircle } from "react-icons/fi";

export default function LogoAnimationPage() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#0B0F19",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* Top Header Bar */}
      <div style={{
        height: "64px",
        padding: "0 24px",
        background: "#0F172A",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#94A3B8",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.05)"
            }}
          >
            <FiArrowLeft size={16} />
            Back to Site
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "15px" }}>
              Comparely Logo Animation
            </span>
            <span style={{
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10B981",
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "9999px"
            }}>
              1080p 60FPS
            </span>
            <span style={{
              background: "rgba(79, 70, 229, 0.15)",
              color: "#818CF8",
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "9999px"
            }}>
              Exact Brand Asset
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setReplayKey(k => k + 1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#4F46E5",
              color: "#FFFFFF",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
            }}
          >
            <FiPlay size={14} />
            Replay
          </button>
        </div>
      </div>

      {/* 16:9 Viewport Stage Container */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "radial-gradient(ellipse at center, #1E1B4B 0%, #090D16 100%)"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1440px",
          aspectRatio: "16 / 9",
          background: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          position: "relative"
        }}>
          <ComparelyLogoAnimation
            key={replayKey}
            standalone={true}
            autoPlay={true}
            showControls={true}
          />
        </div>
      </div>

      {/* Bottom Specs Bar */}
      <div style={{
        height: "44px",
        padding: "0 24px",
        background: "#090D16",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "12px",
        color: "#64748B"
      }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <span><strong style={{ color: "#94A3B8" }}>Duration:</strong> 6.8s (Scenes 1–6)</span>
          <span><strong style={{ color: "#94A3B8" }}>Colors:</strong> #4F46E5, #4338CA, #10B981, #FFFFFF</span>
          <span><strong style={{ color: "#94A3B8" }}>Font:</strong> Plus Jakarta Sans (Geometric Sans)</span>
        </div>
        <div>
          <span style={{ color: "#10B981" }}>Ready for landing page intro & high-res export</span>
        </div>
      </div>
    </div>
  );
}
