export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? "/api" : "http://localhost:5000/api");

let activeRefreshPromise = null;

async function request(path, options = {}) {
  const { headers: customHeaders, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...rest,
    headers: {
      "Content-Type": "application/json",
      "X-Comparely-Client": "web",
      ...(customHeaders || {}),
    },
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    
  }

  if (!res.ok) {
    const error = new Error(
      data?.message ||
        data?.error ||
        "Something went wrong. Please try again."
    );
    error.status = res.status;
    error.code = data?.code;
    error.data = data;
    throw error;
  }

  return data;
}

export async function refreshAuthSession() {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Comparely-Client": "web",
        },
        credentials: "include",
      });

      let data = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok || !data?.token) {
        clearAuth();
        const err = new Error(data?.message || "Session expired. Please log in again.");
        err.status = res.status;
        err.code = data?.code || "SESSION_EXPIRED";
        throw err;
      }

      saveAuth(data);
      return data.token;
    } catch (err) {
      clearAuth();
      throw err;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

export function authRequest(path, options = {}, isRetry = false) {
  const token = localStorage.getItem("token");

  return request(path, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  }).catch(async (error) => {
    // If 401 unauthorized and not already retrying, attempt automatic refresh
    const isAuthEndpoint =
      path.includes("/auth/login") ||
      path.includes("/auth/register") ||
      path.includes("/auth/refresh");

    if (error.status === 401 && !isRetry && !isAuthEndpoint) {
      try {
        const newToken = await refreshAuthSession();
        // Retry the original request with the fresh token
        return request(path, {
          ...options,
          headers: {
            Authorization: `Bearer ${newToken}`,
            ...(options.headers || {}),
          },
        });
      } catch (refreshErr) {
        window.dispatchEvent(new CustomEvent("session-expired", { detail: { error: refreshErr } }));
        throw refreshErr;
      }
    }

    throw error;
  });
}

export function registerUser({
  fullName,
  email,
  password,
  confirmPassword,
}) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName,
      email,
      password,
      confirmPassword,
    }),
  });
}

export function loginUser({
  email,
  password,
}) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function restoreSession() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE_URL}/auth/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Comparely-Client": "web",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    let data = null;
    try {
      data = await res.json();
    } catch {}

    if (res.ok && data?.user) {
      const activeToken = data.token || token;
      if (activeToken) {
        saveAuth({ token: activeToken, user: data.user });
      }
      return {
        authenticated: true,
        user: data.user,
        token: activeToken,
      };
    }
  } catch (err) {
    console.warn("Session restoration network error:", err.message);
  }

  // If restoring via /session fails, try refresh endpoint explicitly
  try {
    const refreshedToken = await refreshAuthSession();
    const storedUser = localStorage.getItem("user");
    let parsedUser = null;
    try { parsedUser = storedUser ? JSON.parse(storedUser) : null; } catch {}
    return {
      authenticated: true,
      user: parsedUser,
      token: refreshedToken,
    };
  } catch {
    clearAuth();
    return {
      authenticated: false,
      user: null,
      token: null,
    };
  }
}

export async function logoutUser() {
  try {
    await request("/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    console.warn("Server logout request warning:", err.message);
  } finally {
    clearAuth();
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("searchHistory");
    localStorage.removeItem("recentProducts");
    localStorage.removeItem("wishlistItems");
    localStorage.removeItem("price_scout_notifications");
    localStorage.removeItem("profilePhoto");
  } catch {}

  window.dispatchEvent(new Event("user-profile-updated"));
  window.dispatchEvent(new Event("user-auth-changed"));
}


export function saveAuth({
  token,
  user,
}) {
  const payload = {
    name: user.fullName,
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",

    avatar:
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
        user.fullName
      )}`,

    provider: "email",

    loggedInAt:
      new Date().toISOString(),
  };

  localStorage.setItem(
    "token",
    token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(payload)
  );

  // Populate session data from database
  if (user.searchHistory && user.searchHistory.length > 0) {
    localStorage.setItem("searchHistory", JSON.stringify(user.searchHistory));
  } else {
    localStorage.removeItem("searchHistory");
  }

  if (user.recentProducts && user.recentProducts.length > 0) {
    localStorage.setItem("recentProducts", JSON.stringify(user.recentProducts));
  } else {
    localStorage.removeItem("recentProducts");
  }

  if (user.wishlist && user.wishlist.length > 0) {
    localStorage.setItem("wishlistItems", JSON.stringify(user.wishlist));
  } else {
    localStorage.removeItem("wishlistItems");
  }

  localStorage.removeItem("price_scout_notifications");
  localStorage.removeItem("profilePhoto");

  window.dispatchEvent(new Event("user-profile-updated"));
  window.dispatchEvent(new Event("user-auth-changed"));
}


export function getProfile() {
  return authRequest("/auth/me", { method: "GET" });
}

export function requestPasswordReset(
  email
) {
  return request(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
}


export function verifyResetOtp({
  email,
  otp,
}) {
  return request(
    "/auth/verify-otp",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  );
}


export function resetPassword({
  resetToken,
  newPassword,
  confirmPassword,
}) {
  return request(
    "/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify({
        resetToken,
        newPassword,
        confirmPassword,
      }),
    }
  );
}





export function getCurrentUser() {
  return authRequest("/auth/me");
}



export function changePassword({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  return authRequest("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmPassword,
    }),
  });
}



export function updateProfile({ name, email, phone, location }) {
  return authRequest("/profile", {
    method: "PUT",
    body: JSON.stringify({ name, email, phone, location }),
  });
}



export function deleteAccount({ password }) {
  return authRequest("/profile", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}



export function updateStoredUser(patch) {
  let existing = {};
  try {
    const raw = localStorage.getItem("user");
    if (raw) existing = JSON.parse(raw);
  } catch {}

  const merged = { ...existing, ...patch };
  localStorage.setItem("user", JSON.stringify(merged));
  window.dispatchEvent(new Event("user-profile-updated"));
  return merged;
}

export function syncUserData(data) {
  return authRequest("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


export function getAlerts() {
  return authRequest("/alerts");
}



export function createAlert(alert) {
  return authRequest("/alerts", {
    method: "POST",
    body: JSON.stringify(alert),
  });
}



export function updateAlert(id, patch) {
  return authRequest(`/alerts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}



export function deleteAlert(id) {
  return authRequest(`/alerts/${id}`, {
    method: "DELETE",
  });
}





export function getVapidPublicKey() {
  return request("/push/vapid-public-key");
}


export function subscribePush({ endpoint, keys }) {
  return authRequest("/push/subscribe", {
    method: "POST",
    body: JSON.stringify({ endpoint, keys }),
  });
}


export function unsubscribePush(endpoint) {
  return authRequest("/push/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ endpoint }),
  });
}





export function getStoredUserEmail() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed?.email || "";
  } catch {
    return "";
  }
}




const LIVE_SEARCH_CACHE_PREFIX = "psa-live-search:";
const LIVE_SEARCH_CACHE_TTL_MS = 30 * 1000; // 30 seconds fresh TTL

function normalizeCacheQuery(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function clearLiveSearchCache() {
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(LIVE_SEARCH_CACHE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {}
}

function readLiveSearchCache(query) {
  try {
    const raw = sessionStorage.getItem(`${LIVE_SEARCH_CACHE_PREFIX}${normalizeCacheQuery(query)}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.savedAt || Date.now() - parsed.savedAt > LIVE_SEARCH_CACHE_TTL_MS) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeLiveSearchCache(query, data) {
  try {
    sessionStorage.setItem(
      `${LIVE_SEARCH_CACHE_PREFIX}${normalizeCacheQuery(query)}`,
      JSON.stringify({
        savedAt: Date.now(),
        data,
      })
    );
  } catch {}
}

export async function searchLiveProducts(
  query,
  { lat, lon, pincode, category } = {}
) {
  const cleanQuery = String(query || "").trim();
  const cleanCategory = String(category || "").trim();

  if (!cleanQuery && !cleanCategory) {
    return {
      status: "success",
      products: [],
    };
  }

  const cacheKey = `${cleanQuery}::${cleanCategory}`;
  const cached = readLiveSearchCache(cacheKey);

  if (cached?.data) {
    return {
      ...cached.data,
      fromBrowserCache: true,
    };
  }

  const params = new URLSearchParams();
  if (cleanQuery) params.set("q", cleanQuery);
  if (cleanCategory && cleanCategory !== "all") params.set("category", cleanCategory);

  if (lat != null) params.set("lat", lat);
  if (lon != null) params.set("lon", lon);
  if (pincode) params.set("pincode", pincode);

  const data = await request(`/products/search?${params.toString()}`);
  writeLiveSearchCache(cacheKey, data);

  return data;
}

export async function searchSpecificLiveProduct(
  productName,
  { lat, lon, pincode, store } = {}
) {
  const cleanName = String(productName || "").trim();
  const cleanStore = String(store || "").trim();

  if (!cleanName) {
    return {
      status: "success",
      product: null,
      products: [],
    };
  }

  const cacheKey = cleanStore ? `${cleanName}_${cleanStore.toLowerCase()}` : cleanName;
  const cached = readLiveSearchCache(cacheKey);

  if (cached?.data) {
    return {
      ...cached.data,
      fromBrowserCache: true,
    };
  }

  const params = new URLSearchParams();
  params.set("name", cleanName);
  if (cleanStore) {
    params.set("store", cleanStore);
  }

  if (lat != null) {
    params.set("lat", lat);
  }

  if (lon != null) {
    params.set("lon", lon);
  }

  if (pincode) {
    params.set("pincode", pincode);
  }

  const data = await request(`/products/specific?${params.toString()}`);

  writeLiveSearchCache(cacheKey, data);

  return data;
}

export async function getLiveComparison(
  productName,
  { lat, lon, pincode, store } = {}
) {
  return searchSpecificLiveProduct(productName, {
    lat,
    lon,
    pincode,
    store,
  });
}