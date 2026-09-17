import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { API_BASE_URL } from "../../utils/api";
import {
  initialAdminStats,
  initialSearchesPerDay,
  initialSearchStatusBreakdown,
  initialSystemHealth,
  initialUsers,
  initialProducts,
  initialSearches,
  initialAutomationJobs,
  initialSources,
  initialSystemLogs,
  initialAdminNotifications
} from "../data/adminMockData";
import { useAdminToast } from "./AdminToastContext";

const AdminDataContext = createContext();

export function AdminDataProvider({ children }) {
  const { addToast } = useAdminToast();

  const [stats, setStats] = useState(initialAdminStats);
  const [searchesPerDay, setSearchesPerDay] = useState(initialSearchesPerDay);
  const [searchStatusBreakdown, setSearchStatusBreakdown] = useState(initialSearchStatusBreakdown);
  const [systemHealth, setSystemHealth] = useState(initialSystemHealth);
  const [users, setUsers] = useState(initialUsers);
  const [products, setProducts] = useState(initialProducts);
  const [searches, setSearches] = useState(initialSearches);
  const [automationJobs, setAutomationJobs] = useState(initialAutomationJobs);
  const [sources, setSources] = useState(initialSources);
  const [systemLogs, setSystemLogs] = useState(initialSystemLogs);
  const [notifications, setNotifications] = useState(initialAdminNotifications);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setGlobalLoading(true);
        // Fetch Users
        const userRes = await fetch(`${API_BASE_URL}/admin/users`);
        if (userRes.ok) {
          const liveUsers = await userRes.json();
          const mappedUsers = liveUsers.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            status: "Active", // Default
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=" + u.name,
            joinedDate: new Date(u.createdAt).toISOString().split('T')[0],
            role: "User",
            lastActive: "Today",
            totalSearches: 0
          }));
          setUsers(mappedUsers);
        }

        // Fetch Stats
        const statsRes = await fetch(`${API_BASE_URL}/admin/stats`);
        if (statsRes.ok) {
          const liveStats = await statsRes.json();
          setStats(prev => ({
            ...prev,
            totalUsers: liveStats.totalUsers.toLocaleString(),
            priceAlerts: liveStats.totalAlerts.toLocaleString(),
            activeScrapers: liveStats.activeScrapers.toLocaleString()
          }));
        }
      } catch (err) {
        console.error("Failed to fetch live admin data", err);
      } finally {
        setGlobalLoading(false);
      }
    };
    fetchLiveData();
  }, []);

  // User Actions
  const toggleUserStatus = useCallback((userId) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "Active" ? "Inactive" : "Active";
          addToast(
            `User ${user.name} (${user.id}) marked as ${newStatus}`,
            newStatus === "Active" ? "success" : "warning"
          );
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  }, [addToast]);

  const deleteUser = useCallback((userId) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast(`User ${target?.name || userId} permanently deleted from system.`, "info");
  }, [users, addToast]);

  const getUserById = useCallback((id) => {
    return users.find((u) => u.id === id) || null;
  }, [users]);

  // Product Actions
  const getProductById = useCallback((id) => {
    return products.find((p) => p.id === id) || null;
  }, [products]);

  // Search Actions
  const getSearchById = useCallback((id) => {
    return searches.find((s) => s.id === id) || null;
  }, [searches]);

  // Automation Job Actions
  const retryJob = useCallback((jobId) => {
    setAutomationJobs((prev) =>
      prev.map((job) => {
        if (job.jobId === jobId) {
          addToast(`Retrying job ${jobId} on source ${job.sourceWebsite}...`, "info");
          return {
            ...job,
            status: "Running",
            progress: 35,
            duration: "Running",
            errorMessage: null
          };
        }
        return job;
      })
    );

    // Simulate scraper progress completion
    setTimeout(() => {
      setAutomationJobs((prev) =>
        prev.map((job) => {
          if (job.jobId === jobId) {
            addToast(`Job ${jobId} successfully completed! Collected items.`, "success");
            return {
              ...job,
              status: "Completed",
              progress: 100,
              duration: "2.1s",
              resultsCollected: 6,
              endTime: new Date().toLocaleTimeString()
            };
          }
          return job;
        })
      );
    }, 2000);
  }, [addToast]);

  const stopJob = useCallback((jobId) => {
    setAutomationJobs((prev) =>
      prev.map((job) => {
        if (job.jobId === jobId) {
          addToast(`Automation job ${jobId} terminated by admin.`, "warning");
          return {
            ...job,
            status: "Failed",
            duration: "Stopped",
            errorMessage: "Job terminated by Admin from management console."
          };
        }
        return job;
      })
    );
  }, [addToast]);

  // Source Actions
  const toggleSourceStatus = useCallback((sourceId) => {
    setSources((prev) =>
      prev.map((source) => {
        if (source.id === sourceId) {
          const nextStatus = source.status === "Enabled" ? "Disabled" : "Enabled";
          addToast(
            `Source ${source.name} connector has been ${nextStatus.toLowerCase()}.`,
            nextStatus === "Enabled" ? "success" : "warning"
          );
          return { ...source, status: nextStatus };
        }
        return source;
      })
    );
  }, [addToast]);

  // Log Actions
  const resolveLog = useCallback((logId) => {
    setSystemLogs((prev) =>
      prev.map((log) => {
        if (log.logId === logId) {
          addToast(`Log ${logId} marked as Resolved.`, "success");
          return { ...log, status: "Resolved" };
        }
        return log;
      })
    );
  }, [addToast]);

  // Notifications Actions
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All admin alerts marked as read", "info");
  }, [addToast]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        stats,
        setStats,
        searchesPerDay,
        setSearchesPerDay,
        searchStatusBreakdown,
        systemHealth,
        users,
        products,
        searches,
        automationJobs,
        sources,
        systemLogs,
        notifications,
        globalLoading,
        setGlobalLoading,
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
        markNotificationAsRead
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
