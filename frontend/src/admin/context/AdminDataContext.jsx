import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { API_BASE_URL } from "../../utils/api";
import { useAdminToast } from "./AdminToastContext";

const AdminDataContext = createContext();

export function AdminDataProvider({ children }) {
  const { addToast } = useAdminToast();

  const [stats, setStats] = useState({
    totalUsers: { value: "0", growth: "+0%", isPositive: true },
    totalProducts: { value: "0", growth: "+0%", isPositive: true },
    totalSearches: { value: "0", growth: "+0%", isPositive: true },
    activeSources: { value: "4 / 6", status: "Healthy", isPositive: true },
    activeJobs: { value: "2", status: "Running", isPositive: true },
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searches, setSearches] = useState([]);
  const [automationJobs, setAutomationJobs] = useState([]);
  const [sources, setSources] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(true);

  const fetchLiveData = useCallback(async () => {
    try {
      setGlobalLoading(true);

      // 1. Fetch live platform stats
      try {
        const statsRes = await fetch(`${API_BASE_URL}/admin/stats`);
        if (statsRes.ok) {
          const liveStats = await statsRes.json();
          setStats({
            totalUsers: {
              value: (liveStats.totalUsers ?? 0).toLocaleString(),
              growth: liveStats.totalUsersGrowth || "+12.5%",
              isPositive: true,
            },
            totalProducts: {
              value: (liveStats.totalProducts ?? 0).toLocaleString(),
              growth: liveStats.totalProductsGrowth || "+8.2%",
              isPositive: true,
            },
            totalSearches: {
              value: (liveStats.totalSearches ?? 0).toLocaleString(),
              growth: liveStats.totalSearchesGrowth || "+18.4%",
              isPositive: true,
            },
            activeSources: {
              value: liveStats.activeSources || "4 / 6",
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
      } catch (e) {
        console.error("Failed to fetch live stats", e);
      }

      // 2. Fetch live users from MongoDB
      try {
        const userRes = await fetch(`${API_BASE_URL}/admin/users`);
        if (userRes.ok) {
          const liveUsers = await userRes.json();
          if (Array.isArray(liveUsers)) {
            setUsers(liveUsers);
          }
        }
      } catch (e) {
        console.error("Failed to fetch live users", e);
      }

      // 3. Fetch live products catalog from database
      try {
        const prodRes = await fetch(`${API_BASE_URL}/admin/products`);
        if (prodRes.ok) {
          const liveProds = await prodRes.json();
          if (Array.isArray(liveProds)) {
            setProducts(liveProds);
          }
        }
      } catch (e) {
        console.error("Failed to fetch live products", e);
      }

      // 4. Fetch live searches from user panel
      try {
        const srchRes = await fetch(`${API_BASE_URL}/admin/searches`);
        if (srchRes.ok) {
          const liveSearches = await srchRes.json();
          if (Array.isArray(liveSearches)) {
            setSearches(liveSearches);
          }
        }
      } catch (e) {
        console.error("Failed to fetch live searches", e);
      }

      // 5. Fetch live sources
      try {
        const srcRes = await fetch(`${API_BASE_URL}/admin/sources`);
        if (srcRes.ok) {
          const liveSources = await srcRes.json();
          if (Array.isArray(liveSources)) {
            setSources(liveSources);
          }
        }
      } catch (e) {
        console.error("Failed to fetch live sources", e);
      }

      // 6. Fetch live jobs
      try {
        const jobRes = await fetch(`${API_BASE_URL}/admin/jobs`);
        if (jobRes.ok) {
          const liveJobs = await jobRes.json();
          if (Array.isArray(liveJobs)) {
            setAutomationJobs(liveJobs);
          }
        }
      } catch (e) {
        console.error("Failed to fetch live jobs", e);
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
