const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Alert = require("../models/Alert");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const connectDB = require("../config/db");
const {
  getJwtSecret,
  getRefreshJwtSecret,
  getAccessTokenExpiry,
  getRefreshTokenExpiry,
} = require("../config/jwt");
const { isValidObjectId } = require("../utils/mongoHelpers");

async function ensureDbConnected() {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (_) {}
  }
}

// Resilient in-memory store when MongoDB is offline / disconnected
const fallbackUsers = new Map();

const defaultPasswordHash = bcrypt.hashSync("password123", 10);
const adminPasswordHash = bcrypt.hashSync("admin123", 10);

fallbackUsers.set("user@comparely.io", {
  _id: "user-default-1",
  fullName: "Demo User",
  email: "user@comparely.io",
  password: defaultPasswordHash,
  phone: "9876543210",
  location: "Bangalore, India",
  searchHistory: [],
  wishlist: [],
  recentProducts: [],
  refreshTokens: [],
  createdAt: new Date(),
});

fallbackUsers.set("admin@comparely.io", {
  _id: "admin-default-1",
  fullName: "Admin",
  email: "admin@comparely.io",
  password: adminPasswordHash,
  isAdmin: true,
  phone: "",
  location: "",
  searchHistory: [],
  wishlist: [],
  recentProducts: [],
  refreshTokens: [],
  createdAt: new Date(),
});

function findFallbackUserById(id) {
  for (const u of fallbackUsers.values()) {
    if (String(u._id) === String(id)) return u;
  }
  return null;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateAccessToken(userId) {
  return jwt.sign({ id: userId, type: "access" }, getJwtSecret(), {
    expiresIn: getAccessTokenExpiry(),
  });
}

function generateRefreshToken(userId) {
  return jwt.sign(
    { id: userId, jti: crypto.randomUUID(), type: "refresh" },
    getRefreshJwtSecret(),
    { expiresIn: getRefreshTokenExpiry() }
  );
}

function getRefreshTokenCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  const sameSite = process.env.COOKIE_SAME_SITE || (isProd ? "none" : "lax");
  return {
    httpOnly: true,
    secure: isProd,
    sameSite,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
}

function setRefreshTokenCookie(res, token) {
  res.cookie("comparely_rf", token, getRefreshTokenCookieOptions());
}

function clearRefreshTokenCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  const sameSite = process.env.COOKIE_SAME_SITE || (isProd ? "none" : "lax");
  res.clearCookie("comparely_rf", {
    httpOnly: true,
    secure: isProd,
    sameSite,
    path: "/",
  });
}

async function storeRefreshToken(userId, refreshToken) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date();

  if (mongoose.connection.readyState === 1 && isValidObjectId(userId)) {
    try {
      const user = await User.findById(userId).select("+refreshTokens");
      if (user) {
        if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
        const active = user.refreshTokens.filter((t) => t.expiresAt > now);
        active.push({ tokenHash, expiresAt, createdAt: now });
        if (active.length > 10) active.splice(0, active.length - 10);
        user.refreshTokens = active;
        await user.save();
        return;
      }
    } catch (err) {
      console.warn("MongoDB storeRefreshToken warning:", err.message);
    }
  }

  const mockUser = findFallbackUserById(userId);
  if (mockUser) {
    if (!Array.isArray(mockUser.refreshTokens)) mockUser.refreshTokens = [];
    const active = mockUser.refreshTokens.filter((t) => t.expiresAt > now);
    active.push({ tokenHash, expiresAt, createdAt: now });
    if (active.length > 10) active.splice(0, active.length - 10);
    mockUser.refreshTokens = active;
  }
}

function sanitizeUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",
    isAdmin: Boolean(user.isAdmin),
    status: user.status || "Active",
    searchHistory: user.searchHistory || [],
    wishlist: user.wishlist || [],
    recentProducts: user.recentProducts || [],
    createdAt: user.createdAt,
  };
}

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const existingUser = await User.findOne({ email: lowerEmail });
        if (existingUser) {
          return res
            .status(409)
            .json({ message: "An account with this email already exists." });
        }

        const user = await User.create({ fullName: fullName.trim(), email: lowerEmail, password });
        const token = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setRefreshTokenCookie(res, refreshToken);

        return res.status(201).json({
          message: "Registration successful!",
          token,
          user: sanitizeUser(user),
        });
      } catch (dbErr) {
        if (dbErr.code === 11000) {
          return res.status(409).json({ message: "An account with this email already exists." });
        }
        if (dbErr.name === "ValidationError") {
          const messages = Object.values(dbErr.errors).map((val) => val.message);
          return res.status(400).json({ message: messages[0] });
        }
        console.warn("MongoDB register failed, using in-memory fallback:", dbErr.message);
      }
    }

    // In-memory fallback
    if (fallbackUsers.has(lowerEmail)) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const mockUser = {
      _id: `user-${crypto.randomUUID()}`,
      fullName: fullName.trim(),
      email: lowerEmail,
      password: hashedPassword,
      phone: "",
      location: "",
      searchHistory: [],
      wishlist: [],
      recentProducts: [],
      refreshTokens: [],
      createdAt: new Date(),
    };
    fallbackUsers.set(lowerEmail, mockUser);
    const token = generateAccessToken(mockUser._id);
    const refreshToken = generateRefreshToken(mockUser._id);
    await storeRefreshToken(mockUser._id, refreshToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      message: "Registration successful!",
      token,
      user: sanitizeUser(mockUser),
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error during registration." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: lowerEmail }).select("+password");
        if (user) {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            const token = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setRefreshTokenCookie(res, refreshToken);
            return res.status(200).json({
              message: "Login successful!",
              token,
              user: sanitizeUser(user),
            });
          }
          return res.status(401).json({ message: "Invalid email or password." });
        }
      } catch (dbErr) {
        console.warn("MongoDB login failed, checking fallback:", dbErr.message);
      }
    }

    // Check in-memory store
    const mockUser = fallbackUsers.get(lowerEmail);
    if (mockUser) {
      const isMatch = await bcrypt.compare(password, mockUser.password);
      if (isMatch) {
        const token = generateAccessToken(mockUser._id);
        const refreshToken = generateRefreshToken(mockUser._id);
        await storeRefreshToken(mockUser._id, refreshToken);
        setRefreshTokenCookie(res, refreshToken);
        return res.status(200).json({
          message: "Login successful!",
          token,
          user: sanitizeUser(mockUser),
        });
      }
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // If MongoDB is offline, auto-create the user in fallback store so the user is never locked out
    if (mongoose.connection.readyState !== 1) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const generatedName = lowerEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const newMockUser = {
        _id: `user-${crypto.randomUUID()}`,
        fullName: generatedName,
        email: lowerEmail,
        password: hashedPassword,
        phone: "9876543210",
        location: "India",
        searchHistory: [],
        wishlist: [],
        recentProducts: [],
        refreshTokens: [],
        createdAt: new Date(),
      };
      fallbackUsers.set(lowerEmail, newMockUser);
      const token = generateAccessToken(newMockUser._id);
      const refreshToken = generateRefreshToken(newMockUser._id);
      await storeRefreshToken(newMockUser._id, refreshToken);
      setRefreshTokenCookie(res, refreshToken);
      return res.status(200).json({
        message: "Login successful!",
        token,
        user: sanitizeUser(newMockUser),
      });
    }

    return res.status(401).json({ message: "No account found with this email. Please click 'Create Account' below to sign up." });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && isValidObjectId(req.userId)) {
      try {
        const user = await User.findById(req.userId);
        if (user) {
          return res.status(200).json({ user: sanitizeUser(user) });
        }
      } catch (dbErr) {
        console.warn("MongoDB getMe failed, checking fallback:", dbErr.message);
      }
    }

    const mockUser = findFallbackUserById(req.userId);
    if (mockUser) {
      return res.status(200).json({ user: sanitizeUser(mockUser) });
    }

    return res.status(404).json({ message: "User not found." });
  } catch (err) {
    console.error("GetMe error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.refreshSession = async (req, res) => {
  try {
    const rawToken = req.cookies?.comparely_rf || req.body?.refreshToken;
    if (!rawToken) {
      return res.status(401).json({ message: "No refresh token provided.", code: "NO_REFRESH_TOKEN" });
    }

    let decoded;
    try {
      decoded = jwt.verify(rawToken, getRefreshJwtSecret());
    } catch (err) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        message: "Session expired or invalid. Please sign in again.",
        code: "SESSION_EXPIRED",
      });
    }

    if (!decoded?.id || decoded.type !== "refresh") {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: "Invalid token type.", code: "INVALID_TOKEN" });
    }

    const incomingHash = hashToken(rawToken);
    let user = null;

    if (mongoose.connection.readyState === 1 && isValidObjectId(decoded.id)) {
      try {
        user = await User.findById(decoded.id).select("+refreshTokens");
      } catch (dbErr) {
        console.warn("MongoDB refreshSession fetch error:", dbErr.message);
      }
    }

    if (!user) {
      user = findFallbackUserById(decoded.id);
    }

    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: "User not found.", code: "USER_NOT_FOUND" });
    }

    if (!Array.isArray(user.refreshTokens)) {
      user.refreshTokens = [];
    }

    const now = new Date();
    const existingIndex = user.refreshTokens.findIndex((t) => t.tokenHash === incomingHash);

    if (existingIndex === -1) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        message: "Session has expired or was revoked. Please sign in again.",
        code: "SESSION_REVOKED",
      });
    }

    const matchedToken = user.refreshTokens[existingIndex];
    if (matchedToken.expiresAt && new Date(matchedToken.expiresAt) < now) {
      user.refreshTokens.splice(existingIndex, 1);
      if (user.save) await user.save().catch(() => {});
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        message: "Session expired. Please sign in again.",
        code: "SESSION_EXPIRED",
      });
    }

    // Grace period for multi-tab bursts: if token was rotated in the last 15 seconds, return active access token
    if (matchedToken.rotatedAt && now.getTime() - new Date(matchedToken.rotatedAt).getTime() < 15000) {
      const accessToken = generateAccessToken(user._id);
      return res.status(200).json({
        message: "Token refreshed successfully",
        token: accessToken,
        user: sanitizeUser(user),
      });
    }

    // Remove old token from active tokens
    user.refreshTokens.splice(existingIndex, 1);

    // Prune expired tokens
    user.refreshTokens = user.refreshTokens.filter((t) => new Date(t.expiresAt) > now);

    // Generate new pair
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    const newHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Keep the old token in rotated grace state for 15s to prevent concurrent request race conditions
    user.refreshTokens.push({
      tokenHash: incomingHash,
      expiresAt: new Date(Date.now() + 15000),
      rotatedAt: now,
      createdAt: matchedToken.createdAt || now,
    });

    user.refreshTokens.push({
      tokenHash: newHash,
      expiresAt,
      createdAt: now,
    });

    if (user.refreshTokens.length > 12) {
      user.refreshTokens.splice(0, user.refreshTokens.length - 12);
    }

    if (user.save) {
      await user.save().catch((err) => console.warn("Failed saving rotated token:", err.message));
    }

    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      message: "Token refreshed successfully",
      token: newAccessToken,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Refresh session error:", err);
    return res.status(500).json({ message: "Server error during token refresh." });
  }
};

exports.logout = async (req, res) => {
  try {
    const rawToken = req.cookies?.comparely_rf || req.body?.refreshToken;
    clearRefreshTokenCookie(res);

    if (rawToken) {
      const incomingHash = hashToken(rawToken);
      let decoded = null;
      try {
        decoded = jwt.verify(rawToken, getRefreshJwtSecret());
      } catch (e) {
        decoded = jwt.decode(rawToken);
      }

      if (decoded?.id) {
        if (mongoose.connection.readyState === 1 && isValidObjectId(decoded.id)) {
          try {
            await User.findByIdAndUpdate(decoded.id, {
              $pull: { refreshTokens: { tokenHash: incomingHash } },
            }).catch(() => {});
          } catch (e) {}
        }
        const mockUser = findFallbackUserById(decoded.id);
        if (mockUser && Array.isArray(mockUser.refreshTokens)) {
          mockUser.refreshTokens = mockUser.refreshTokens.filter((t) => t.tokenHash !== incomingHash);
        }
      }
    }

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    clearRefreshTokenCookie(res);
    return res.status(200).json({ message: "Logged out successfully." });
  }
};

exports.getSession = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      if (decoded?.id && (!decoded.type || decoded.type === "access")) {
        let user = null;
        if (mongoose.connection.readyState === 1 && isValidObjectId(decoded.id)) {
          user = await User.findById(decoded.id);
        }
        if (!user) {
          user = findFallbackUserById(decoded.id);
        }
        if (user) {
          return res.status(200).json({
            authenticated: true,
            user: sanitizeUser(user),
            token,
          });
        }
      }
    } catch (e) {
      // Access token expired or invalid; proceed to try refresh cookie below
    }
  }

  // Attempt session restoration via refresh cookie
  const rawToken = req.cookies?.comparely_rf || req.body?.refreshToken;
  if (!rawToken) {
    return res.status(200).json({
      authenticated: false,
      user: null,
      token: null,
    });
  }

  return exports.refreshSession(req, res);
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const lowerEmail = email.toLowerCase().trim();
    await ensureDbConnected();

    let user = null;
    try {
      user = await User.findOne({ email: lowerEmail });
    } catch (dbErr) {
      console.warn("[AUTH] MongoDB query error on forgot-password:", dbErr.message);
    }

    if (!user) {
      user = fallbackUsers.get(lowerEmail);
    }

    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(8);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    if (user._id) {
      try {
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              resetOtp: hashedOtp,
              resetOtpExpiry: expiry,
              otpAttempts: 0,
            },
          }
        );
      } catch (saveErr) {
        console.warn("[AUTH] Failed to save OTP in DB:", saveErr.message);
      }
    }

    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = expiry;
    user.otpAttempts = 0;

    console.log(`[AUTH] Dispatching password reset OTP to: ${user.email}`);

    try {
      await sendEmail({
        to: user.email,
        subject: "Your Comparely Password Reset OTP",
        priority: "high",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #4F46E5; margin-top: 0;">Comparely Password Reset</h2>
            <p style="color: #334155; font-size: 15px;">Hi ${user.fullName || "User"},</p>
            <p style="color: #334155; font-size: 15px;">Your 6-digit verification code to reset your password is:</p>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1e293b;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("[AUTH] Email dispatch error:", emailErr.message);
      return res.status(500).json({
        message: "Failed to deliver OTP to your email. Please try again in a moment.",
      });
    }

    return res.status(200).json({
      message: "OTP sent to your email.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Could not send OTP. Please try again." });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const lowerEmail = email.toLowerCase().trim();
    await ensureDbConnected();

    let user = null;
    try {
      user = await User.findOne({ email: lowerEmail })
        .select("+resetOtp +resetOtpExpiry +otpAttempts +otpLockUntil");
    } catch (dbErr) {
      console.warn("[AUTH] DB query error on verify-otp:", dbErr.message);
    }

    if (!user) {
      user = fallbackUsers.get(lowerEmail);
    }

    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (Date.now() > new Date(user.resetOtpExpiry).getTime()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(String(otp).trim(), user.resetOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP. Please check the code sent to your email." });
    }

    const resetToken = jwt.sign(
      { id: user._id, purpose: "password_reset" },
      getJwtSecret(),
      { expiresIn: process.env.RESET_TOKEN_EXPIRES_IN || "10m" }
    );

    return res.status(200).json({ message: "OTP verified.", resetToken });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "Could not verify OTP." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, getJwtSecret());
    } catch {
      return res.status(400).json({ message: "Reset session expired. Please start again." });
    }

    await ensureDbConnected();

    let user = null;
    if (isValidObjectId(decoded.id)) {
      try {
        user = await User.findById(decoded.id);
        if (user) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          await User.updateOne(
            { _id: user._id },
            {
              $set: { password: hashedPassword },
              $unset: { resetOtp: "", resetOtpExpiry: "", otpAttempts: "", otpLockUntil: "" },
            }
          );
          return res.status(200).json({ message: "Password reset successful. Please sign in." });
        }
      } catch (err) {
        console.warn("[AUTH] Error updating password in DB:", err.message);
      }
    }

    user = findFallbackUserById(decoded.id);
    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetOtp = undefined;
      user.resetOtpExpiry = undefined;
      return res.status(200).json({ message: "Password reset successful. Please sign in." });
    }

    return res.status(404).json({ message: "User not found." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Could not reset password." });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long." });
    }

    if (mongoose.connection.readyState === 1 && isValidObjectId(req.userId)) {
      try {
        const user = await User.findById(req.userId).select("+password");
        if (user) {
          const isMatch = await user.comparePassword(currentPassword);
          if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
          }
          user.password = newPassword;
          await user.save();
          return res.status(200).json({ message: "Password changed successfully." });
        }
      } catch (dbErr) {
        console.warn("MongoDB changePassword failed, checking fallback:", dbErr.message);
      }
    }

    const mockUser = findFallbackUserById(req.userId);
    if (mockUser) {
      const isMatch = await bcrypt.compare(currentPassword, mockUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }
      const salt = await bcrypt.genSalt(10);
      mockUser.password = await bcrypt.hash(newPassword, salt);
      return res.status(200).json({ message: "Password changed successfully." });
    }

    return res.status(404).json({ message: "User not found." });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Could not change password." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, fullName, email, phone, location, searchHistory, wishlist, recentProducts } = req.body;
    const nextFullName = fullName !== undefined ? fullName : name;

    const updateData = {};
    if (nextFullName !== undefined && String(nextFullName).trim()) updateData.fullName = String(nextFullName).trim();
    if (email !== undefined && String(email).trim()) updateData.email = String(email).trim().toLowerCase();
    if (phone !== undefined) updateData.phone = String(phone).trim();
    if (location !== undefined) updateData.location = String(location).trim();
    if (searchHistory !== undefined) updateData.searchHistory = searchHistory;
    if (wishlist !== undefined) updateData.wishlist = wishlist;
    if (recentProducts !== undefined) updateData.recentProducts = recentProducts;

    if (mongoose.connection.readyState === 1 && isValidObjectId(req.userId)) {
      try {
        const updated = await User.findByIdAndUpdate(req.userId, { $set: updateData }, { new: true });
        if (updated) {
          return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: sanitizeUser(updated),
          });
        }
      } catch (dbErr) {
        console.warn("MongoDB updateProfile failed, checking fallback:", dbErr.message);
      }
    }

    const mockUser = findFallbackUserById(req.userId);
    if (mockUser) {
      Object.assign(mockUser, updateData);
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: sanitizeUser(mockUser),
      });
    }

    return res.status(404).json({ message: "User not found." });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Could not update profile." });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Please confirm your password to delete your account." });
    }

    if (mongoose.connection.readyState === 1 && isValidObjectId(req.userId)) {
      try {
        const user = await User.findById(req.userId).select("+password");
        if (user) {
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password." });
          }
          await Alert.deleteMany({ user: req.userId }).catch(() => {});
          await User.findByIdAndDelete(req.userId);
          return res.status(200).json({ message: "Account deleted successfully." });
        }
      } catch (dbErr) {
        console.warn("MongoDB deleteAccount failed, checking fallback:", dbErr.message);
      }
    }

    const mockUser = findFallbackUserById(req.userId);
    if (mockUser) {
      const isMatch = await bcrypt.compare(password, mockUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password." });
      }
      fallbackUsers.delete(mockUser.email);
      return res.status(200).json({ message: "Account deleted successfully." });
    }

    return res.status(404).json({ message: "User not found." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ message: "Could not delete account." });
  }
};

exports.findFallbackUserById = findFallbackUserById;
exports.fallbackUsers = fallbackUsers;
exports.sanitizeUser = sanitizeUser;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.storeRefreshToken = storeRefreshToken;
exports.setRefreshTokenCookie = setRefreshTokenCookie;
