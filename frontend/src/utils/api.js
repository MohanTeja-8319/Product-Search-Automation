const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}

export function registerUser({ fullName, email, password, confirmPassword }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password, confirmPassword }),
  });
}

export function loginUser({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function saveAuth({ token, user }) {
  const payload = {
    name: user.fullName,
    email: user.email,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.fullName)}`,
    provider: "email",
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(payload));
}

export function requestPasswordReset(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyResetOtp({ email, otp }) {
  return request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export function resetPassword({ resetToken, newPassword, confirmPassword }) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
  });
}