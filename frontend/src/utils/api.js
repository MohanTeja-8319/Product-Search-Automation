const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

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
    // No JSON body
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
        "Something went wrong. Please try again."
    );
  }

  return data;
}

/* Same as `request`, but attaches the logged-in user's JWT
   (from localStorage) so the backend can identify them. */
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


/* =========================
   AUTH
========================= */

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


/* =========================
   LOGGED-IN USER (change password / edit profile)
========================= */

/* Fetches the currently logged-in user's data from the backend
   using the JWT — used to prefill the Edit Profile form so
   fields are never blank if the data already exists. */
export function getCurrentUser() {
  return authRequest("/auth/me");
}


/* Changes the password for the SAME existing user account.
   Requires the current password to be verified server-side. */
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


/* Updates ONLY the profile fields provided. The backend identifies
   the user from the JWT and preserves every other existing value. */
export function updateProfile({ name, email, phone, location }) {
  return authRequest("/profile", {
    method: "PUT",
    body: JSON.stringify({ name, email, phone, location }),
  });
}


/* Permanently deletes the logged-in user's account (and everything
   owned by them, e.g. price alerts) from the database. Requires the
   current password to confirm. */
export function deleteAccount({ password }) {
  return authRequest("/profile", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}


/* Merges an updated user object into localStorage without wiping
   out local-only fields (avatar, badge, accentRing, provider). */
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


/* =========================
   PRICE ALERTS
========================= */

/* Fetches every price alert that belongs to the logged-in user. */
export function getAlerts() {
  return authRequest("/alerts");
}


/* Creates (or refreshes, if one already exists for the same product)
   a price alert for the logged-in user. */
export function createAlert(alert) {
  return authRequest("/alerts", {
    method: "POST",
    body: JSON.stringify(alert),
  });
}


/* Updates one alert (e.g. toggling active/paused, or simulating a
   price drop). `id` is the alert's Mongo _id. */
export function updateAlert(id, patch) {
  return authRequest(`/alerts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}


/* Deletes one alert belonging to the logged-in user. */
export function deleteAlert(id) {
  return authRequest(`/alerts/${id}`, {
    method: "DELETE",
  });
}


/* =========================
   BROWSER PUSH NOTIFICATIONS
========================= */

/* Public VAPID key the frontend needs to create a PushManager subscription.
   Not auth-protected — it's not secret. */
export function getVapidPublicKey() {
  return request("/push/vapid-public-key");
}

/* Saves this browser's push subscription for the logged-in user so the
   alert monitor can send it real push notifications later. */
export function subscribePush({ endpoint, keys }) {
  return authRequest("/push/subscribe", {
    method: "POST",
    body: JSON.stringify({ endpoint, keys }),
  });
}

/* Removes this browser's push subscription (e.g. user turned push off). */
export function unsubscribePush(endpoint) {
  return authRequest("/push/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ endpoint }),
  });
}


/* =========================
   CURRENT USER HELPERS
========================= */

/* Reads the logged-in user's registered email straight out of localStorage
   (saved at login/registration) so alert forms can default to it instead
   of a placeholder like "user@example.com". Returns "" if not logged in. */
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


/* =========================
   LIVE SEARCH CACHE
========================= */

const LIVE_SEARCH_CACHE_PREFIX =
  "psa-live-search:";


function normalizeCacheQuery(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


function readLiveSearchCache(query) {
  try {
    const raw =
      sessionStorage.getItem(
        `${LIVE_SEARCH_CACHE_PREFIX}${normalizeCacheQuery(
          query
        )}`
      );

    return raw
      ? JSON.parse(raw)
      : null;
  } catch {
    return null;
  }
}


function writeLiveSearchCache(
  query,
  data
) {
  try {
    sessionStorage.setItem(
      `${LIVE_SEARCH_CACHE_PREFIX}${normalizeCacheQuery(
        query
      )}`,
      JSON.stringify({
        savedAt: Date.now(),
        data,
      })
    );
  } catch {
    // Cache failure should never break search.
  }
}


/* =========================
   LIVE SEARCH
========================= */

/*
  SearchPage uses this function.

  IMPORTANT:
  We call /products/search,
  NOT /products/specific.

  /search returns multiple products.
*/
export async function searchLiveProducts(
  query,
  { lat, lon, pincode } = {}
) {
  const cleanQuery =
    String(query || "").trim();

  if (!cleanQuery) {
    return {
      status: "success",
      products: [],
    };
  }


  /* Browser cache */
  const cached =
    readLiveSearchCache(cleanQuery);

  if (cached?.data) {
    return {
      ...cached.data,
      fromBrowserCache: true,
    };
  }


  /* Query parameters */
  const params =
    new URLSearchParams();

  params.set("q", cleanQuery);

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


  /* Correct endpoint */
  const data = await request(
    `/products/search?${params.toString()}`
  );


  /* Save result */
  writeLiveSearchCache(
    cleanQuery,
    data
  );


  return data;
}


/* =========================
   SPECIFIC PRODUCT
========================= */

/*
  Used when we need ONE exact product
  across Amazon + Flipkart + Myntra.
*/
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


/* =========================
   LIVE COMPARISON
========================= */

export async function getLiveComparison(
  productName,
  { lat, lon, pincode } = {}
) {
  /*
    Use the same specific-product
    cache so clicking Compare does
    not make another API request.
  */

  return searchSpecificLiveProduct(
    productName,
    {
      lat,
      lon,
      pincode,
    }
  );
}