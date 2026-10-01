const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Alert = require("../models/Alert");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
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

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ fullName, email, password });
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Registration successful!",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages[0] });
    }
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

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ user: sanitizeUser(user) });
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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    user.resetOtp = await bcrypt.hash(otp, salt);
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; 
    user.otpAttempts = 0;
    user.otpLockUntil = undefined;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your password reset OTP",
      html: `
        <p>Hi ${user.fullName},</p>
        <p>Your OTP to reset your password is:</p>
        <h2 style="letter-spacing:4px;">${otp}</h2>
        <p>This code expires in 2 minutes. If you didn't request this, you can ignore this email.</p>
      `,
    });

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

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetOtp +resetOtpExpiry +otpAttempts +otpLockUntil"
    );
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (user.otpLockUntil && user.otpLockUntil > Date.now()) {
      return res.status(429).json({ message: "Too many failed attempts. Try again later." });
    }

    if (Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      if (user.otpAttempts >= 5) {
        user.otpLockUntil = Date.now() + 15 * 60 * 1000; 
        await user.save();
        return res.status(429).json({ message: "Too many failed attempts. Account locked for 15 minutes." });
      }
      await user.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }
    
    
    user.otpAttempts = 0;
    user.otpLockUntil = undefined;
    await user.save();

    
    
    const resetToken = jwt.sign(
      { id: user._id, purpose: "password_reset" },
      process.env.JWT_SECRET,
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
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: "Reset session expired. Please start again." });
    }
    if (decoded.purpose !== "password_reset") {
      return res.status(400).json({ message: "Invalid reset token." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = newPassword; 
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful. Please sign in." });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages[0] });
    }
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

    
    
    const user = await User.findById(req.userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different from the current password." });
    }

    
    
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Could not change password." });
  }
};




exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { name, fullName, email, phone, location } = req.body;
    const nextFullName = fullName !== undefined ? fullName : name;

    
    
    if (nextFullName !== undefined && nextFullName !== null) {
      const trimmedName = String(nextFullName).trim();
      if (!trimmedName) {
        return res.status(400).json({ message: "Full name cannot be empty." });
      }
      user.fullName = trimmedName;
    }

    if (email !== undefined && email !== null) {
      const trimmedEmail = String(email).trim();
      if (!trimmedEmail) {
        return res.status(400).json({ message: "Email cannot be empty." });
      }
      if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
      }

      const lowerEmail = trimmedEmail.toLowerCase();
      if (lowerEmail !== user.email) {
        const existingUser = await User.findOne({ email: lowerEmail });
        if (existingUser && String(existingUser._id) !== String(user._id)) {
          return res
            .status(409)
            .json({ message: "This email is already in use by another account." });
        }
        user.email = lowerEmail;
      }
    }

    const updateData = {};
    if (trimmedName && trimmedName !== user.fullName) updateData.fullName = trimmedName;
    if (trimmedEmail && trimmedEmail.toLowerCase() !== user.email) updateData.email = trimmedEmail.toLowerCase();
    if (phone !== undefined && phone !== null) updateData.phone = String(phone).trim();
    if (location !== undefined && location !== null) updateData.location = String(location).trim();

    const { searchHistory, wishlist, recentProducts } = req.body;
    if (searchHistory !== undefined) updateData.searchHistory = searchHistory;
    if (wishlist !== undefined) updateData.wishlist = wishlist;
    if (recentProducts !== undefined) updateData.recentProducts = recentProducts;

    const updatedUser = await User.findByIdAndUpdate(user._id, { $set: updateData }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(updatedUser || user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "This email is already in use by another account." });
    }
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

    const user = await User.findById(req.userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const userId = user._id;

    
    
    await Alert.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ message: "Could not delete account." });
  
  }

}
