import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser, FiMail, FiTrash2,
  FiAlertTriangle, FiLock, FiBell,
  FiSave, FiSmartphone, FiCamera, FiX
} from "react-icons/fi";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import toast from "react-hot-toast";
import {
  getCurrentUser,
  updateProfile as updateProfileApi,
  changePassword as changePasswordApi,
  deleteAccount as deleteAccountApi,
  updateStoredUser,
} from "../utils/api";
import { enableBrowserPush, disableBrowserPush, getExistingPushSubscription } from "../utils/push";


function getInitials(name = "") {
  return name.trim().split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
}
function getStoredPhoto() {
  try { return localStorage.getItem("profilePhoto") || null; } catch { return null; }
}
function saveStoredPhoto(dataUrl) {
  try { localStorage.setItem("profilePhoto", dataUrl); } catch {}
}
function clearStoredPhoto() {
  try { localStorage.removeItem("profilePhoto"); } catch {}
}

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(getStoredPhoto);

  const showToast = (message, type = "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  };

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          fullName: parsed.name || parsed.fullName || "User",
          email: parsed.email || "",
          phone: parsed.phone || "",
          provider: parsed.provider || "local",
        };
      }
    } catch {}
    return { fullName: "User", email: "", phone: "", provider: "local" };
  });

  const [notifications, setNotifications] = useState({ pushPriceDrops: false });
  const [securityForm, setSecurityForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast("Image must be under 2 MB.", "error"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPhotoPreview(dataUrl);
      saveStoredPhoto(dataUrl);
      window.dispatchEvent(new Event("profile-photo-updated"));
      showToast("Profile photo updated!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    clearStoredPhoto();
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.dispatchEvent(new Event("profile-photo-updated"));
    showToast("Profile photo removed.", "success");
  };

  const initials = getInitials(profile.fullName);

  useEffect(() => {
    let cancelled = false;
    async function loadProfileFromServer() {
      try {
        const res = await getCurrentUser();
        const serverUser = res?.user;
        if (!serverUser || cancelled) return;
        setProfile((prev) => ({
          ...prev,
          fullName: serverUser.fullName || prev.fullName,
          email: serverUser.email || prev.email,
          phone: serverUser.phone || prev.phone,
        }));
        updateStoredUser({ name: serverUser.fullName, fullName: serverUser.fullName, email: serverUser.email, phone: serverUser.phone });
      } catch (err) {}
    }
    loadProfileFromServer();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getExistingPushSubscription().then((sub) => {
      if (!cancelled) setNotifications((prev) => ({ ...prev, pushPriceDrops: !!sub }));
    });
    return () => { cancelled = true; };
  }, []);

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleNotificationChange = (name, value) => {
    setNotifications((prev) => ({ ...prev, [name]: value }));
    if (name === "pushPriceDrops") {
      if (value) enableBrowserPush().then(() => showToast("Push notifications enabled.", "success")).catch((err) => {
        setNotifications((prev) => ({ ...prev, pushPriceDrops: false }));
        showToast(err.message, "error");
      });
      else disableBrowserPush().then(() => showToast("Push notifications disabled.", "success")).catch(() => {});
    }
  };



  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await updateProfileApi({ name: profile.fullName, email: profile.email, phone: profile.phone });
      const updatedUser = updateStoredUser({
        name: res?.user?.fullName ?? profile.fullName,
        email: res?.user?.email ?? profile.email,
        phone: res?.user?.phone ?? profile.phone,
        provider: profile.provider,
      });
      setProfile((prev) => ({
        ...prev,
        fullName: updatedUser.fullName || prev.fullName,
        email: updatedUser.email || prev.email,
        phone: updatedUser.phone ?? prev.phone,
      }));
      showToast("Profile saved successfully!", "success");
    } catch (err) { showToast(err.message, "error"); } finally { setSavingProfile(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!securityForm.currentPassword || !securityForm.newPassword || securityForm.newPassword !== securityForm.confirmPassword) {
      showToast("Invalid password inputs.", "error"); return;
    }
    setSavingPassword(true);
    try {
      await changePasswordApi(securityForm);
      showToast("Password updated!", "success");
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { showToast(err.message, "error"); } finally { setSavingPassword(false); }
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword) { setDeleteError("Please enter your password."); return; }
    setDeletingAccount(true);
    try {
      await deleteAccountApi({ password: deletePassword });
      localStorage.clear(); sessionStorage.clear();
      window.dispatchEvent(new Event("user-profile-updated"));
      navigate("/login");
    } catch (err) { setDeleteError(err.message); } finally { setDeletingAccount(false); }
  };

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text-900)", marginBottom: 8 }}>Settings</h1>
            <p style={{ fontSize: 14, color: "var(--text-500)" }}>Manage your account preferences, security, and notifications.</p>
          </div>

          <div className="settings-grid" style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
            
            <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 24 }}>
              {}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-900)", marginBottom: 24 }}>Personal Information</h3>

                {}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        style={{
                          width: 88, height: 88, borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid var(--primary)",
                          boxShadow: "0 0 0 4px var(--primary-light)"
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 88, height: 88, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary), #7C3AED)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 28, fontWeight: 800, color: "white",
                        fontFamily: "'Poppins', sans-serif",
                        border: "3px solid var(--primary)",
                        boxShadow: "0 0 0 4px var(--primary-light)",
                        userSelect: "none"
                      }}>
                        {initials}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload photo"
                      style={{
                        position: "absolute", bottom: 0, right: 0,
                        width: 28, height: 28, borderRadius: "50%",
                        background: "var(--primary)", color: "white",
                        border: "2px solid var(--surface)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "var(--transition)"
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <FiCamera size={13} />
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-700)", margin: 0 }}>Profile Photo</p>
                    <p style={{ fontSize: 12, color: "var(--text-400)", margin: 0, lineHeight: 1.5 }}>
                      {photoPreview ? "Your custom photo is active." : "No photo — initials shown by default."}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline btn-sm">
                        <FiCamera size={12} /> {photoPreview ? "Change Photo" : "Upload Photo"}
                      </button>
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="btn btn-sm"
                          style={{ background: "var(--danger-light)", color: "var(--danger)", border: "none" }}
                        >
                          <FiX size={12} /> Remove
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-400)", margin: 0 }}>JPG, PNG, WEBP — max 2 MB</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: "none" }}
                    onChange={handlePhotoChange}
                  />
                </div>

                <form onSubmit={handleSaveChanges} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-700)", marginBottom: 8 }}>Full Name</label>
                    <div style={{ position: "relative" }}>
                      <FiUser style={{ position: "absolute", left: 16, top: 14, color: "var(--text-400)" }} />
                      <input type="text" name="fullName" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="input" style={{ paddingLeft: 44 }} required />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-700)", marginBottom: 8 }}>Email Address</label>
                    <div style={{ position: "relative" }}>
                      <FiMail style={{ position: "absolute", left: 16, top: 14, color: "var(--text-400)" }} />
                      <input type="email" name="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input" style={{ paddingLeft: 44 }} disabled={profile.provider !== "local"} />
                    </div>
                    {profile.provider !== "local" && (
                      <p style={{ fontSize: 11, color: "var(--text-400)", marginTop: 4 }}>Email cannot be changed for social sign-ins.</p>
                    )}
                  </div>
                  <button type="submit" disabled={savingProfile} className="btn btn-primary">
                    <FiSave /> {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              {}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-900)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><FiLock /> Security & Password</h3>
                <form onSubmit={handlePasswordUpdate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <input type="password" placeholder="Current Password" value={securityForm.currentPassword} onChange={e => setSecurityForm({...securityForm, currentPassword: e.target.value})} className="input" />
                  <input type="password" placeholder="New Password" value={securityForm.newPassword} onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})} className="input" />
                  <input type="password" placeholder="Confirm New Password" value={securityForm.confirmPassword} onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})} className="input" />
                  <button type="submit" disabled={savingPassword} className="btn btn-primary" style={{ alignSelf: "flex-start" }}>Update Password</button>
                </form>
              </div>

            </div>

            <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 24 }}>
              
              {}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-900)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><FiBell /> Notifications</h3>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "var(--bg)", borderRadius: "var(--radius-md)" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-900)", display: "flex", alignItems: "center", gap: 8 }}>
                      <FiSmartphone /> Browser Push Alerts
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-500)", marginTop: 4 }}>Get instant notifications when prices drop.</div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input type="checkbox" checked={notifications.pushPriceDrops} onChange={e => handleNotificationChange("pushPriceDrops", e.target.checked)} style={{ width: 44, height: 24, cursor: "pointer" }} />
                  </label>
                </div>
              </div>

              {}
              <div className="card" style={{ padding: 24, border: "1px solid var(--danger-light)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--danger)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><FiAlertTriangle /> Danger Zone</h3>
                <p style={{ fontSize: 13, color: "var(--text-500)", marginBottom: 16 }}>Permanently delete your account and all associated price alerts and data.</p>
                
                {!showDeleteModal ? (
                  <button onClick={() => setShowDeleteModal(true)} className="btn btn-outline" style={{ color: "var(--danger)", borderColor: "var(--danger-light)" }}>
                    <FiTrash2 /> Delete Account
                  </button>
                ) : (
                  <div style={{ padding: 16, background: "var(--danger-light)", borderRadius: "var(--radius-sm)" }}>
                    <p style={{ fontSize: 13, color: "var(--danger)", fontWeight: 600, marginBottom: 12 }}>This action is irreversible. Enter your password to confirm.</p>
                    <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} className="input" style={{ marginBottom: 12 }} placeholder="Your Password" />
                    {deleteError && <div style={{ fontSize: 12, color: "var(--danger)", marginBottom: 12 }}>{deleteError}</div>}
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={confirmDeleteAccount} disabled={deletingAccount} className="btn" style={{ background: "var(--danger)", color: "white" }}>{deletingAccount ? "Deleting..." : "Confirm Delete"}</button>
                      <button onClick={() => { setShowDeleteModal(false); setDeleteError(""); }} className="btn btn-outline">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .settings-grid { flex-direction: column !important; }
          .settings-grid > div { width: 100% !important; min-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
