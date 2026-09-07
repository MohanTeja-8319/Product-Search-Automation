const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
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
    createdAt: user.createdAt,
  };
}

// @route POST /api/auth/register
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
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error during registration." });
  }
};

// @route POST /api/auth/login
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

// @route GET /api/auth/me  (protected)
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

// @route POST /api/auth/forgot-password
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

    const otp = crypto.randomInt(1000, 9999).toString(); // 4-digit OTP // 6-digit OTP
    const salt = await require("bcryptjs").genSalt(10);
    user.resetOtp = await require("bcryptjs").hash(otp, salt);
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
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

// @route POST /api/auth/verify-otp
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetOtp +resetOtpExpiry"
    );
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await require("bcryptjs").compare(otp, user.resetOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP correct — issue a short-lived reset token so the client doesn't
    // need to resend the OTP on the final reset-password step.
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

// @route POST /api/auth/reset-password
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

    user.password = newPassword; // pre-save hook hashes it
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful. Please sign in." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Could not reset password." });
  }
};