import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
 FiBell,
 FiCheck,
 FiTrash2,
 FiExternalLink,
 FiX,
 FiTrendingDown,
 FiShoppingBag,
 FiZap,
 FiCheckCircle,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";

const DEFAULT_NOTIFICATIONS = [];

const Notification = () => {
 const navigate = useNavigate();
 const [isOpen, setIsOpen] = useState(false);
 const [filter, setFilter] = useState("all"); 
 const [notifications, setNotifications] = useState(() => {
 try {
 const stored = localStorage.getItem("price_scout_notifications");
 if (stored) {
 return JSON.parse(stored);
 }
 } catch {}
 return DEFAULT_NOTIFICATIONS;
 });

 const dropdownRef = useRef(null);

 
 useEffect(() => {
 try {
 localStorage.setItem("price_scout_notifications", JSON.stringify(notifications));
 } catch {}
 }, [notifications]);

 
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

 const handleMarkAsRead = (id, e) => {
 if (e) e.stopPropagation();
 setNotifications((prev) =>
 prev.map((n) => (n.id === id ? { ...n, read: true } : n))
 );
 };

 const handleMarkAllAsRead = () => {
 setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
 };

 const handleDelete = (id, e) => {
 if (e) e.stopPropagation();
 setNotifications((prev) => prev.filter((n) => n.id !== id));
 };

 const handleClearAll = () => {
 setNotifications([]);
 };

 const handleNotificationClick = (item) => {
 handleMarkAsRead(item.id);
 setIsOpen(false);
 if (item.link) {
 navigate(item.link);
 }
 };

 return (
 <div className="relative" ref={dropdownRef}>
 {}
 <button
 type="button"
 onClick={() => setIsOpen(!isOpen)}
 className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-xs relative cursor-pointer border ${
 isOpen
 ? "bg-indigo-50 text-indigo-600 border-indigo-200 "
 : "bg-white hover:bg-slate-50 :bg-slate-950 :bg-slate-800 text-slate-700 border-slate-200/90 "
 }`}
 title={`Notifications (${unreadCount} unread)`}
 aria-expanded={isOpen}
 >
 <FiBell className="text-lg" />

 {}
 {unreadCount > 0 && (
 <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-soft animate-pulse">
 {unreadCount > 9 ? "9+" : unreadCount}
 </span>
 )}
 </button>

 {}
 {isOpen && (
 <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-[16px] shadow-2xl border border-slate-200/90 py-3 z-50 animate-fadeIn">
 {}
 <div className="px-4 pb-3 border-b border-slate-200 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <h3 className="font-extrabold text-sm text-slate-900 ">
 Notifications
 </h3>
 {unreadCount > 0 && (
 <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">
 {unreadCount} new
 </span>
 )}
 </div>

 <div className="flex items-center gap-2">
 {unreadCount > 0 && (
 <button
 type="button"
 onClick={handleMarkAllAsRead}
 className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
 title="Mark all as read"
 >
 <FiCheck className="text-xs" />
 <span>Mark all read</span>
 </button>
 )}
 {notifications.length > 0 && (
 <button
 type="button"
 onClick={handleClearAll}
 className="text-[11px] font-medium text-slate-400 hover:text-rose-600 transition cursor-pointer"
 title="Clear all notifications"
 >
 Clear all
 </button>
 )}
 {}
 <button
 type="button"
 onClick={() => setIsOpen(false)}
 className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 :bg-slate-700 text-slate-500 hover:text-slate-900 :text-white :text-white flex items-center justify-center transition cursor-pointer ml-1"
 title="Close notifications"
 >
 <FiX className="text-sm" />
 </button>
 </div>
 </div>

 {}
 <div className="px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
 <button
 onClick={() => setFilter("all")}
 className={`px-2.5 py-1 rounded-[10px] font-bold transition cursor-pointer ${
 filter === "all"
 ? "bg-slate-900 text-white "
 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
 }`}
 >
 All ({notifications.length})
 </button>
 <button
 onClick={() => setFilter("unread")}
 className={`px-2.5 py-1 rounded-[10px] font-bold transition cursor-pointer ${
 filter === "unread"
 ? "bg-indigo-600 text-white"
 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
 }`}
 >
 Unread ({unreadCount})
 </button>
 <button
 onClick={() => setFilter("price_drop")}
 className={`px-2.5 py-1 rounded-[10px] font-bold transition cursor-pointer ${
 filter === "price_drop"
 ? "bg-emerald-600 text-white"
 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
 }`}
 >
 Price Drops 
 </button>
 </div>

 {}
 <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 ">
 {filteredNotifications.length > 0 ? (
 filteredNotifications.map((item) => (
 <div
 key={item.id}
 onClick={() => handleNotificationClick(item)}
 className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 :bg-slate-950 :bg-slate-800/60 transition cursor-pointer relative group ${
 !item.read
 ? "bg-indigo-50/40 "
 : "opacity-80"
 }`}
 >
 {}
 <div
 className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-sm shrink-0 shadow-xs ${
 item.type === "price_drop"
 ? "bg-rose-50 text-rose-600 border border-rose-200 "
 : item.type === "target_reached"
 ? "bg-emerald-50 text-emerald-600 border border-emerald-200 "
 : "bg-indigo-50 text-indigo-600 border border-indigo-200 "
 }`}
 >
 {item.type === "price_drop" ? (
 <FiTrendingDown />
 ) : item.type === "target_reached" ? (
 <FaFire />
 ) : (
 <FiZap />
 )}
 </div>

 {}
 <div className="flex-1 min-w-0 pr-4">
 <div className="flex items-center justify-between gap-1">
 <h4 className="font-extrabold text-xs text-slate-900 truncate">
 {item.title}
 </h4>
 <span className="text-[10px] text-slate-400 shrink-0">
 {item.time}
 </span>
 </div>

 <p className="text-xs text-slate-600 mt-1 leading-snug">
 {item.message}
 </p>

 <div className="flex items-center gap-2 mt-2">
 {item.discount && (
 <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
 {item.discount}
 </span>
 )}
 {item.store && (
 <span className="text-[10px] text-slate-400 font-semibold">
 via {item.store}
 </span>
 )}
 </div>
 </div>

 {}
 <div className="flex flex-col items-center gap-1 shrink-0">
 {!item.read && (
 <span className="w-2 h-2 rounded-full bg-indigo-600 "></span>
 )}
 <button
 onClick={(e) => handleDelete(item.id, e)}
 className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer rounded-md hover:bg-slate-200 :bg-slate-700"
 title="Dismiss notification"
 >
 <FiX className="text-xs" />
 </button>
 </div>
 </div>
 ))
 ) : (
 <div className="py-10 text-center px-4">
 <div className="w-12 h-12 rounded-[16px] bg-slate-100 flex items-center justify-center text-2xl mx-auto mb-2 text-slate-400">
 
 </div>
 <h4 className="font-bold text-xs text-slate-800 ">
 All caught up!
 </h4>
 <p className="text-[11px] text-slate-400 mt-0.5">
 No {filter === "unread" ? "unread " : ""}notifications at this time.
 </p>
 </div>
 )}
 </div>

 {}
 <div className="pt-2.5 px-4 border-t border-slate-200 text-center">
 <button
 onClick={() => {
 setIsOpen(false);
 navigate("/pricealerts");
 }}
 className="text-xs font-bold text-indigo-600 hover:underline flex items-center justify-center gap-1.5 w-full cursor-pointer py-1"
 >
 <span>Manage Price Drop Alerts</span>
 <FiExternalLink className="text-xs" />
 </button>
 </div>
 </div>
 )}
 </div>
 );
};

export default Notification;