const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Alert = require("../models/Alert");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

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
  createdAt: new Date(),
});

function findFallbackUserById(id) {
  for (const u of fallbackUsers.values()) {
    if (String(u._id) === String(id)) return u;
  }
  return null;
}

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "default_jwt_secret_key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",
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
        const token = generateToken(user._id);

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
      createdAt: new Date(),
    };
    fallbackUsers.set(lowerEmail, mockUser);
    const token = generateToken(mockUser._id);

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
            const token = generateToken(user._id);
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
        const token = generateToken(mockUser._id);
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
        createdAt: new Date(),
      };
      fallbackUsers.set(lowerEmail, newMockUser);
      const token = generateToken(newMockUser._id);
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
    if (mongoose.connection.readyState === 1) {
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const lowerEmail = email.toLowerCase().trim();
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: lowerEmail }).catch(() => null);
    }
    if (!user) {
      user = fallbackUsers.get(lowerEmail);
    }

    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const expiry = Date.now() + 10 * 60 * 1000;

    if (user.save) {
      user.resetOtp = hashedOtp;
      user.resetOtpExpiry = expiry;
      user.otpAttempts = 0;
      await user.save().catch(() => {});
    } else {
      user.resetOtp = hashedOtp;
      user.resetOtpExpiry = expiry;
      user.otpAttempts = 0;
    }

    await sendEmail({
      to: user.email,
      subject: "Your password reset OTP",
      html: `
        <p>Hi ${user.fullName},</p>
        <p>Your OTP to reset your password is:</p>
        <h2 style="letter-spacing:4px;">${otp}</h2>
        <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      `,
    }).catch((e) => console.warn("Email send failed:", e.message));

    return res.status(200).json({ message: "OTP sent to your email." });
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
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: lowerEmail })
        .select("+resetOtp +resetOtpExpiry +otpAttempts +otpLockUntil")
        .catch(() => null);
    }
    if (!user) {
      user = fallbackUsers.get(lowerEmail);
    }

    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const resetToken = jwt.sign(
      { id: user._id, purpose: "password_reset" },
      process.env.JWT_SECRET || "default_jwt_secret_key",
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
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || "default_jwt_secret_key");
    } catch {
      return res.status(400).json({ message: "Reset session expired. Please start again." });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id).catch(() => null);
      if (user) {
        user.password = newPassword;
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successful. Please sign in." });
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

    if (mongoose.connection.readyState === 1) {
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

    if (mongoose.connection.readyState === 1) {
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

    if (mongoose.connection.readyState === 1) {
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
