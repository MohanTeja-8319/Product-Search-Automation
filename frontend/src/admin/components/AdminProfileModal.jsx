import React, { useState } from "react";
import { FiX, FiShield, FiMail, FiCalendar, FiClock, FiKey, FiCheckCircle } from "react-icons/fi";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminToast } from "../context/AdminToastContext";

export function AdminProfileModal({ isOpen, onClose }) {
 const { adminUser, updateProfile } = useAdminAuth();
 const { addToast } = useAdminToast();

 const [name, setName] = useState(adminUser?.name || "Mohan Teja");
 const [email, setEmail] = useState(adminUser?.email || "admin@productautomation.io");
 const [isEditing, setIsEditing] = useState(false);

 if (!isOpen) return null;

 const handleSave = (e) => {
 e.preventDefault();
 updateProfile({ name, email });
 setIsEditing(false);
 addToast("Admin profile updated successfully", "success");
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 {}
 <div
 className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
 onClick={onClose}
 />

 {}
 <div className="relative bg-white rounded-[16px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 z-10 animate-scaleUp overflow-hidden">
 {}
 <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700" />

 <button
 onClick={onClose}
 className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 :text-slate-300 p-1.5 rounded-[10px] hover:bg-slate-100 :bg-slate-800 transition-colors"
 >
 <FiX className="text-lg" />
 </button>

 <div className="flex items-center gap-4 pt-2">
 <div className="relative">
 <img
 src={adminUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"}
 alt={adminUser?.name}
 className="w-16 h-16 rounded-[16px] object-cover border-2 border-indigo-600 shadow-soft"
 />
 <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 border-2 border-white rounded-full"></span>
 </div>

 <div>
 <div className="flex items-center gap-2">
 <h2 className="text-xl font-bold text-slate-900 ">{adminUser?.name}</h2>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
 ADMIN
 </span>
 </div>
 <p className="text-xs text-slate-500 ">{adminUser?.role}</p>
 <p className="text-[11px] text-slate-400 mt-0.5">{adminUser?.department}</p>
 </div>
 </div>

 {}
 <div className="mt-6">
 {isEditing ? (
 <form onSubmit={handleSave} className="space-y-4">
 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">
 Full Name
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-[10px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
 required
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">
 Email Address
 </label>
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-[10px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
 required
 />
 </div>

 <div className="flex justify-end gap-2 pt-2">
 <button
 type="button"
 onClick={() => setIsEditing(false)}
 className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 :bg-slate-800 rounded-[10px]"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-[10px] shadow-xs"
 >
 Save Changes
 </button>
 </div>
 </form>
 ) : (
 <div className="space-y-3 bg-slate-50 p-4 rounded-[16px] border border-slate-200 text-xs">
 <div className="flex items-center justify-between py-1 border-b border-slate-200/60 ">
 <span className="flex items-center gap-2 text-slate-500 ">
 <FiMail className="text-slate-400 text-sm" /> Email Address
 </span>
 <span className="font-semibold text-slate-800 ">{adminUser?.email}</span>
 </div>

 <div className="flex items-center justify-between py-1 border-b border-slate-200/60 ">
 <span className="flex items-center gap-2 text-slate-500 ">
 <FiShield className="text-slate-400 text-sm" /> Access Level
 </span>
 <span className="font-semibold text-emerald-600 flex items-center gap-1">
 <FiCheckCircle className="text-xs" /> {adminUser?.accessLevel}
 </span>
 </div>

 <div className="flex items-center justify-between py-1 border-b border-slate-200/60 ">
 <span className="flex items-center gap-2 text-slate-500 ">
 <FiClock className="text-slate-400 text-sm" /> Last Active Session
 </span>
 <span className="font-medium text-slate-700 ">{adminUser?.lastLogin}</span>
 </div>

 <div className="flex items-center justify-between py-1">
 <span className="flex items-center gap-2 text-slate-500 ">
 <FiKey className="text-slate-400 text-sm" /> Two-Factor Authentication
 </span>
 <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
 ENFORCED
 </span>
 </div>
 </div>
 )}
 </div>

 {}
 {!isEditing && (
 <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200 ">
 <span className="text-[11px] text-slate-400">
 Admin Node ID: <strong className="font-mono text-slate-600 ">AUTH-NODE-01</strong>
 </span>
 <div className="flex gap-2">
 <button
 type="button"
 onClick={() => setIsEditing(true)}
 className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-[10px] transition-colors"
 >
 Edit Profile
 </button>
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-[10px] transition-colors"
 >
 Close
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}

export default AdminProfileModal;
