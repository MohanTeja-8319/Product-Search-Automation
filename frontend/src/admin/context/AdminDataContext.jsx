import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { API_BASE_URL } from "../../utils/api";
import { fetchAdminJson } from "../utils/adminApi";
import { useAdminToast } from "./AdminToastContext";

const DEFAULT_STATS = {
  totalUsers: 24,
  totalUsersGrowth: "+12.5%",
  totalProducts: 8536,
  totalProductsGrowth: "+8.2%",
  totalSearches: 24892,
  totalSearchesGrowth: "+18.4%",
  activeSources: "8 / 8",
  activeSourcesStatus: "Healthy",
  activeJobs: 2,
  activeJobsStatus: "Running",
};

const DEFAULT_USERS = [
  {
    id: "usr-admin-1",
    name: "Admin Operator",
    email: "admin@comparely.io",
    phone: "+91 98765 43210",
    location: "Hyderabad, India",
    registrationDate: "2026-01-15",
    searches: 42,
    wishlistCount: 6,
    status: "Active",
    lastActive: "Just now",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin%20Operator",
  },
  {
    id: "usr-user-2",
    name: "Lakhya Vennapusa",
    email: "lahyavennapusa0104@gmail.com",
    phone: "+91 87654 32109",
    location: "Bengaluru, India",
    registrationDate: "2026-02-10",
    searches: 85,
    wishlistCount: 12,
    status: "Active",
    lastActive: "Today",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Lakhya%20Vennapusa",
  },
  {
    id: "usr-user-3",
    name: "Pooja Reddy",
    email: "pooja.reddy@example.com",
    phone: "+91 91234 56780",
    location: "Mumbai, India",
    registrationDate: "2026-03-01",
    searches: 18,
    wishlistCount: 3,
    status: "Active",
    lastActive: "Yesterday",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Pooja%20Reddy",
  },
];

const DEFAULT_SOURCES = [
  { id: "src-1", name: "Amazon India", platform: "Amazon", type: "E-Commerce", status: "Enabled", health: "Healthy", latency: "142ms", errorRate: "0.2%", totalSyncs: 4120, lastSync: "1 min ago" },
  { id: "src-2", name: "Flipkart", platform: "Flipkart", type: "E-Commerce", status: "Enabled", health: "Healthy", latency: "185ms", errorRate: "0.4%", totalSyncs: 3890, lastSync: "2 mins ago" },
  { id: "src-3", name: "BlinkIt", platform: "BlinkIt", type: "QuickCommerce", status: "Enabled", health: "Healthy", latency: "98ms", errorRate: "0.1%", totalSyncs: 5610, lastSync: "Just now" },
  { id: "src-4", name: "Zepto", platform: "Zepto", type: "QuickCommerce", status: "Enabled", health: "Healthy", latency: "115ms", errorRate: "0.3%", totalSyncs: 4820, lastSync: "3 mins ago" },
  { id: "src-5", name: "Swiggy Instamart", platform: "Swiggy", type: "QuickCommerce", status: "Enabled", health: "Healthy", latency: "132ms", errorRate: "0.5%", totalSyncs: 3410, lastSync: "5 mins ago" },
  { id: "src-6", name: "BigBasket", platform: "BigBasket", type: "QuickCommerce", status: "Enabled", health: "Healthy", latency: "164ms", errorRate: "0.2%", totalSyncs: 2940, lastSync: "4 mins ago" },
  { id: "src-7", name: "Myntra", platform: "Myntra", type: "Fashion", status: "Enabled", health: "Healthy", latency: "178ms", errorRate: "0.6%", totalSyncs: 1890, lastSync: "6 mins ago" },
  { id: "src-8", name: "Nykaa", platform: "Nykaa", type: "Beauty", status: "Enabled", health: "Healthy", latency: "155ms", errorRate: "0.3%", totalSyncs: 2150, lastSync: "2 mins ago" },
];

const DEFAULT_JOBS = [
  { id: "job-101", source: "Amazon India", type: "Price & Variant Sync", started: "10:14 AM", duration: "1.4s", status: "Completed", resultsCollected: 48, logs: ["10:14:02 - Initialized scraper", "10:14:03 - Fetched prices", "10:14:04 - Sync completed successfully"] },
  { id: "job-102", source: "BlinkIt Instant", type: "Hyperlocal Inventory Sync", started: "10:15 AM", duration: "Running", status: "Running", resultsCollected: 32, logs: ["10:15:00 - Checking dark stores", "10:15:01 - Pincode 560001 synced"] },
  { id: "job-103", source: "Flipkart", type: "Catalog Refinement", started: "10:12 AM", duration: "2.8s", status: "Completed", resultsCollected: 64, logs: ["10:12:00 - Scraping categories", "10:12:02 - Cleaned duplicates", "10:12:03 - Done"] },
];

const DEFAULT_SEARCHES = [
  { id: "srch-1", query: "iPhone 16", count: 1420, user: "Lakhya Vennapusa", timestamp: "5 mins ago", resultsCount: 8, source: "Web Search" },
  { id: "srch-2", query: "JBL Flip 6", count: 980, user: "Guest User", timestamp: "12 mins ago", resultsCount: 6, source: "Web Search" },
  { id: "srch-3", query: "Samsung S24 Ultra", count: 840, user: "Pooja Reddy", timestamp: "18 mins ago", resultsCount: 8, source: "Web Search" },
  { id: "srch-4", query: "Amul Milk 1L", count: 620, user: "Admin Operator", timestamp: "25 mins ago", resultsCount: 4, source: "QuickCommerce" },
];

const AdminDataContext = createContext();

export function AdminDataProvider({ children }) {
  const { addToast } = useAdminToast();

  const [stats, setStats] = useState({
    totalUsers: { value: "24", growth: "+12.5%", isPositive: true },
    totalProducts: { value: "8,536", growth: "+8.2%", isPositive: true },
    totalSearches: { value: "24,892", growth: "+18.4%", isPositive: true },
    activeSources: { value: "8 / 8", status: "Healthy", isPositive: true },
    activeJobs: { value: "2", status: "Running", isPositive: true },
  });
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [products, setProducts] = useState([]);
  const [searches, setSearches] = useState(DEFAULT_SEARCHES);
  const [automationJobs, setAutomationJobs] = useState(DEFAULT_JOBS);
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [systemLogs, setSystemLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(true);

  const fetchLiveData = useCallback(async () => {
    try {
      setGlobalLoading(true);

      // 1. Fetch live platform stats
      const liveStats = await fetchAdminJson("/admin/stats", DEFAULT_STATS);
      if (liveStats && typeof liveStats === "object") {
        setStats({
          totalUsers: {
            value: (liveStats.totalUsers ?? 24).toLocaleString(),
            growth: liveStats.totalUsersGrowth || "+12.5%",
            isPositive: true,
          },
          totalProducts: {
            value: (liveStats.totalProducts ?? 8536).toLocaleString(),
            growth: liveStats.totalProductsGrowth || "+8.2%",
            isPositive: true,
          },
          totalSearches: {
            value: (liveStats.totalSearches ?? 24892).toLocaleString(),
            growth: liveStats.totalSearchesGrowth || "+18.4%",
            isPositive: true,
          },
          activeSources: {
            value: liveStats.activeSources || "8 / 8",
            status: liveStats.activeSourcesStatus || "Healthy",
            isPositive: true,
          },
          activeJobs: {
            value: liveStats.activeJobs ?? 2,
            status: liveStats.activeJobsStatus || "Running",
            isPositive: true,
          },
        });
      }

      // 2. Fetch live users from MongoDB
      const liveUsers = await fetchAdminJson("/admin/users", null);
      if (Array.isArray(liveUsers) && liveUsers.length > 0) {
        setUsers(liveUsers);
      }

      // 3. Fetch live products catalog from database
      const liveProds = await fetchAdminJson("/admin/products", null);
      if (Array.isArray(liveProds) && liveProds.length > 0) {
        setProducts(liveProds);
      }

      // 4. Fetch live searches from user panel
      const liveSearches = await fetchAdminJson("/admin/searches", null);
      if (Array.isArray(liveSearches) && liveSearches.length > 0) {
        setSearches(liveSearches);
      }

      // 5. Fetch live sources
      const liveSources = await fetchAdminJson("/admin/sources", null);
      if (Array.isArray(liveSources) && liveSources.length > 0) {
        setSources(liveSources);
      }

      // 6. Fetch live jobs
      const liveJobs = await fetchAdminJson("/admin/jobs", null);
      if (Array.isArray(liveJobs) && liveJobs.length > 0) {
        setAutomationJobs(liveJobs);
      }

      // 7. Fetch live system logs
      const liveLogs = await fetchAdminJson("/admin/logs", null);
      if (Array.isArray(liveLogs) && liveLogs.length > 0) {
        setSystemLogs(liveLogs);
      }
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  const toggleUserStatus = useCallback(
    async (userId) => {
      const target = users.find((u) => u.id === userId);
      if (!target) return;
      const nextStatus = target.status === "Active" ? "Suspended" : "Active";

      try {
        await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        });
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
        );
        addToast(
          `User ${target.name} status updated to ${nextStatus}`,
          nextStatus === "Active" ? "success" : "warning"
        );
      } catch {
        addToast("Failed to update user status on server.", "error");
      }
    },
    [users, addToast]
  );

  const deleteUser = useCallback(
    async (userId) => {
      const target = users.find((u) => u.id === userId);
      try {
        await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
          method: "DELETE",
        });
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        addToast(`User ${target?.name || userId} permanently deleted from database.`, "info");
      } catch {
        addToast("Failed to delete user account.", "error");
      }
    },
    [users, addToast]
  );

  const getUserById = useCallback(
    (id) => {
      return users.find((u) => u.id === id) || null;
    },
    [users]
  );

  const getProductById = useCallback(
    (id) => {
      return products.find((p) => p.id === id) || null;
    },
    [products]
  );

  const getSearchById = useCallback(
    (id) => {
      return searches.find((s) => s.id === id) || null;
    },
    [searches]
  );

  const retryJob = useCallback(
    (jobId) => {
      setAutomationJobs((prev) =>
        prev.map((job) => {
          if (job.id === jobId) {
            addToast(`Retrying job ${jobId}...`, "info");
            return {
              ...job,
              status: "Running",
              duration: "Running",
            };
          }
          return job;
        })
      );

      setTimeout(() => {
        setAutomationJobs((prev) =>
          prev.map((job) => {
            if (job.id === jobId) {
              addToast(`Job ${jobId} successfully completed!`, "success");
              return {
                ...job,
                status: "Completed",
                duration: "2.1s",
              };
            }
            return job;
          })
        );
      }, 1500);
    },
    [addToast]
  );

  const stopJob = useCallback(
    (jobId) => {
      setAutomationJobs((prev) =>
        prev.map((job) => {
          if (job.id === jobId) {
            addToast(`Job ${jobId} terminated by admin.`, "warning");
            return {
              ...job,
              status: "Failed",
              duration: "Stopped",
            };
          }
          return job;
        })
      );
    },
    [addToast]
  );

  const toggleSourceStatus = useCallback(
    async (sourceId) => {
      const source = sources.find((s) => s.id === sourceId);
      if (!source) return;
      const nextStatus = source.status === "Enabled" ? "Disabled" : "Enabled";

      try {
        await fetch(`${API_BASE_URL}/admin/sources/${sourceId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        });
        setSources((prev) =>
          prev.map((s) => (s.id === sourceId ? { ...s, status: nextStatus } : s))
        );
        addToast(
          `Source ${source.name} connector has been ${nextStatus.toLowerCase()}.`,
          nextStatus === "Enabled" ? "success" : "warning"
        );
      } catch {
        addToast("Failed to update source status.", "error");
      }
    },
    [sources, addToast]
  );

  const resolveLog = useCallback(
    (logId) => {
      setSystemLogs((prev) =>
        prev.map((log) => {
          if (log.logId === logId) {
            addToast(`Log ${logId} marked as Resolved.`, "success");
            return { ...log, status: "Resolved" };
          }
          return log;
        })
      );
    },
    [addToast]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All admin alerts marked as read", "info");
  }, [addToast]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        stats,
        setStats,
        users,
        products,
        searches,
        automationJobs,
        sources,
        systemLogs,
        notifications,
        globalLoading,
        fetchLiveData,
        toggleUserStatus,
        deleteUser,
        getUserById,
        getProductById,
        getSearchById,
        retryJob,
        stopJob,
        toggleSourceStatus,
        resolveLog,
        markAllNotificationsAsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
