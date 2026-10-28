import React, { useState, useEffect } from "react";
import {
  subscribeInstallPrompt,
  triggerInstallPrompt,
  isAppStandalone,
  subscribeNetworkStatus
} from "../utils/pwaHelper";
import "./PwaStatusBanner.css";

export default function PwaStatusBanner() {
  const [canInstall, setCanInstall] = useState(false);  
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("pwa_install_dismissed") === "true";
    } catch {
      return false;
    }
  });
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // 1. Subscribe to network status
    const unsubNetwork = subscribeNetworkStatus((online) => {
      setIsOnline(online);
    });

    // 2. Subscribe to install prompt
    const unsubInstall = subscribeInstallPrompt((available) => {
      if (!isAppStandalone()) {
        setCanInstall(available);
      }
    });

    // 3. Listen for SW update
    const handleUpdate = () => {
      setUpdateAvailable(true);
    };
    window.addEventListener("pwa-update-available", handleUpdate);

    return () => {
      unsubNetwork();
      unsubInstall();
      window.removeEventListener("pwa-update-available", handleUpdate);
    };
  }, []);

  const handleInstallClick = async () => {
    await triggerInstallPrompt();
    setCanInstall(false);
  };

  const handleDismissInstall = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("pwa_install_dismissed", "true");
    } catch {}
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Offline Status Notification */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            background: "#DC2626",
            color: "#FFFFFF",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 500,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          <span>You are currently offline. Price comparison requires an active connection.</span>
        </div>
      )}

      {/* New Version Update Banner */}
      {updateAvailable && (
        <aside role="alert" className="pwa-update-wrapper">
          <div className="pwa-update-card">
            <div style={{ flex: 1, fontSize: "13px" }}>
              <span style={{ fontWeight: 700, display: "block", color: "var(--primary)" }}>Update Available</span>
              A new version of Comparely is ready.
            </div>
            <button
              onClick={handleRefresh}
              className="pwa-btn-install"
              style={{ padding: "6px 14px", fontSize: "12px" }}
            >
              Update
            </button>
          </div>
        </aside>
      )}

      {/* Discrete PWA Install Banner - Landing Page UI Themed & Animated */}
      {canInstall && !isDismissed && (
        <aside
          aria-label="Install Comparely Application"
          className="pwa-install-wrapper"
        >
          <div className="pwa-install-card">
            <div className="pwa-icon-box">
              <img
                src="/pwa-192x192.png"
                alt="Comparely App Icon"
                className="pwa-app-icon"
              />
              <span className="pwa-live-dot" title="Ready to install" />
            </div>

            <div className="pwa-install-info">
              <div className="pwa-install-title-row">
                <span className="pwa-install-title">Install Comparely</span>
                <span className="pwa-badge">Fast App</span>
              </div>
              <div className="pwa-install-desc">
                Compare prices faster with home screen access
              </div>
            </div>

            <div className="pwa-actions">
              <button
                onClick={handleInstallClick}
                className="pwa-btn-install"
                aria-label="Install Comparely Application"
              >
                Install
              </button>
              <button
                onClick={handleDismissInstall}
                aria-label="Dismiss install banner"
                className="pwa-btn-dismiss"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
