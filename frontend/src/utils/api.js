export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? "/api" : "http://localhost:5000/api");

async function request(path, options = {}) {
  const { headers: customHeaders, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(customHeaders || {}),
    },
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
        "Something went wrong. Please try again."
    );
  }

  return data;
}


function authRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  return request(path, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
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
  { lat, lon, pincode } = {}
) {
  const cleanName =
    String(productName || "").trim();

  if (!cleanName) {
    return {
      status: "success",
      product: null,
      products: [],
    };
  }


  const cached =
    readLiveSearchCache(
      cleanName
    );

  if (cached?.data) {
    return {
      ...cached.data,
      fromBrowserCache: true,
    };
  }


  const params =
    new URLSearchParams();

  params.set(
    "name",
    cleanName
  );

  if (lat != null) {
    params.set("lat", lat);
  }

  if (lon != null) {
    params.set("lon", lon);
  }

  if (pincode) {
    params.set(
      "pincode",
      pincode
    );
  }


  const data = await request(
    `/products/specific?${params.toString()}`
  );


  writeLiveSearchCache(
    cleanName,
    data
  );


  return data;
}




export async function getLiveComparison(
  productName,
  { lat, lon, pincode } = {}
) {
  

  return searchSpecificLiveProduct(
    productName,
    {
      lat,
      lon,
      pincode,
    }
  );
}