import { API_BASE_URL } from "../../utils/api";

/**
 * Safely fetches JSON from the admin API without ever throwing SyntaxError
 * when encountering HTML or proxy fallback responses.
 */
export async function fetchAdminJson(path, fallback = null) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Accept: "application/json",
        "x-admin-session": "true",
      },
    });

    if (!res.ok) return fallback;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return fallback;
    }

    const data = await res.json();
    return data ?? fallback;
  } catch (err) {
    return fallback;
  }
}

