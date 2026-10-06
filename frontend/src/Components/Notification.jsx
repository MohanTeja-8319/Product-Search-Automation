import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiCheck,
  FiX,
  FiTrendingDown,
  FiZap,
  FiExternalLink,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import {
  getStoredNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  syncAlertsToNotifications,
} from "../utils/notificationHelper";

export default function Notification() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(() => getStoredNotifications());

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Initial sync of any stored alerts
    syncAlertsToNotifications();
    setNotifications(getStoredNotifications());

    const handleUpdate = () => {
      setNotifications(getStoredNotifications());
    };

    window.addEventListener("notificationsUpdated", handleUpdate);
    window.addEventListener("priceAlertsUpdated", () => {
      syncAlertsToNotifications();
      setNotifications(getStoredNotifications());
    });

    return () => {
      window.removeEventListener("notificationsUpdated", handleUpdate);
      window.removeEventListener("priceAlertsUpdated", handleUpdate);
    };
  }, []);

  // Close on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "price_drop") return n.type === "price_drop" || n.type === "target_reached";
    return true;
  });

  const handleItemClick = (item) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    } else {
      navigate("/pricealerts");
    }
  };

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    removeNotification(id);
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn btn-ghost"
        style={{
          padding: "10px",
          borderRadius: "var(--radius-full)",
          position: "relative",
          background: isOpen ? "var(--bg)" : "transparent",
        }}
        title={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
      >
        <FiBell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              background: "var(--danger)",
              color: "#fff",
              borderRadius: "50%",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 6px rgba(239,68,68,0.5)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "min(380px, 92vw)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 1000,
            overflow: "hidden",
            animation: "fadeIn 0.15s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--surface)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-900)" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--primary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  title="Mark all as read"
                >
                  <FiCheck size={12} /> Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 11,
                    color: "var(--text-400)",
                    cursor: "pointer",
                  }}
                  title="Clear all"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-400)",
                  cursor: "pointer",
                  padding: 2,
                  display: "flex",
                }}
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div
            style={{
              padding: "8px 14px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              gap: 6,
              background: "var(--bg)",
            }}
          >
            {[
              { id: "all", label: `All (${notifications.length})` },
              { id: "unread", label: `Unread (${unreadCount})` },
              { id: "price_drop", label: "Price Drops" },
            ].map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "var(--radius-full)",
                    fontSize: 11,
                    fontWeight: active ? 700 : 500,
                    border: "none",
                    cursor: "pointer",
                    background: active ? "var(--primary)" : "transparent",
                    color: active ? "#fff" : "var(--text-600)",
                    transition: "var(--transition)",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Notifications List */}
          <div
            style={{
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => {
                const isPriceDrop = item.type === "price_drop";
                const isTarget = item.type === "target_reached";

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      borderBottom: "1px solid var(--border)",
                      background: item.read ? "transparent" : "var(--primary-light)",
                      cursor: "pointer",
                      transition: "var(--transition)",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (item.read) e.currentTarget.style.background = "var(--bg)";
                    }}
                    onMouseLeave={(e) => {
                      if (item.read) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Icon Badge */}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        flexShrink: 0,
                        background: isPriceDrop
                          ? "#FEE2E2"
                          : isTarget
                          ? "#FEF3C7"
                          : "var(--primary-light)",
                        color: isPriceDrop
                          ? "#EF4444"
                          : isTarget
                          ? "#D97706"
                          : "var(--primary)",
                      }}
                    >
                      {isPriceDrop ? (
                        <FiTrendingDown />
                      ) : isTarget ? (
                        <FaFire />
                      ) : (
                        <FiZap />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                        }}
                      >
                        <h4
                          style={{
                            fontSize: 13,
                            fontWeight: item.read ? 600 : 700,
                            color: "var(--text-900)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.title}
                        </h4>
                        <span style={{ fontSize: 10, color: "var(--text-400)", flexShrink: 0 }}>
                          {item.time || "Recently"}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-600)",
                          margin: "3px 0 6px",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.message}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {item.discount && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: 4,
                              background: "var(--success-light)",
                              color: "var(--success)",
                            }}
                          >
                            {item.discount}
                          </span>
                        )}
                        {item.store && (
                          <span style={{ fontSize: 10, color: "var(--text-400)" }}>
                            via {item.store}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      {!item.read && (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--primary)",
                          }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDismiss(item.id, e)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-400)",
                          cursor: "pointer",
                          padding: 2,
                        }}
                        title="Dismiss"
                      >
                        <FiX size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "36px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🔔</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-900)" }}>
                  All caught up!
                </div>
                <div style={{ fontSize: 12, color: "var(--text-400)", marginTop: 4 }}>
                  No {filter === "unread" ? "unread " : ""}notifications at this time.
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid var(--border)",
              background: "var(--surface)",
              textAlign: "center",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/pricealerts");
              }}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "4px 0",
              }}
            >
              <span>Manage Price Drop Alerts</span>
              <FiExternalLink size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}