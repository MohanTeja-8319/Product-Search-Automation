import { API_BASE_URL } from "../../utils/api";

export function getAdminToken() {
  try {
    return localStorage.getItem("admin_token") || localStorage.getItem("token") || null;
  } catch {
    return null;
  }
}

export function setAdminToken(token) {
  try {
    if (token) {
      localStorage.setItem("admin_token", token);
      localStorage.setItem("token", token);
    } else {
      clearAdminToken();
    }
  } catch {}
}

export function clearAdminToken() {
  try {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("psa_admin_is_auth");
    localStorage.removeItem("psa_admin_session");
  } catch {}
}

/**
 * Core admin request helper with automatic Bearer token injection
 * and 401/403 session expiration interception.
 */
export async function adminRequest(path, options = {}) {
  const token = getAdminToken();

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 || response.status === 403) {
    let errData = null;
    try {
      errData = await response.json();
    } catch {}

    const error = new Error(errData?.message || "Administrator session expired or unauthorized.");
    error.status = response.status;
    error.code = errData?.code || "ADMIN_UNAUTHORIZED";

    window.dispatchEvent(
      new CustomEvent("admin-auth-expired", { detail: { error, status: response.status } })
    );

    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    let errData = null;
    if (contentType.includes("application/json")) {
      try {
        errData = await response.json();
      } catch {}
    }
    const error = new Error(errData?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  return null;
}

/**
 * Safely fetches JSON from the admin API without throwing SyntaxError,
 * returning the fallback value on any network or parsing error.
 */
export async function fetchAdminJson(path, fallback = null) {
  try {
    const data = await adminRequest(path, { method: "GET" });
    return data ?? fallback;
  } catch (err) {
    return fallback;
  }
}

export async function adminPost(path, body = {}) {
  return await adminRequest(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminPatch(path, body = {}) {
  return await adminRequest(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function adminPut(path, body = {}) {
  return await adminRequest(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function adminDelete(path) {
  return await adminRequest(path, {
    method: "DELETE",
  });
}
