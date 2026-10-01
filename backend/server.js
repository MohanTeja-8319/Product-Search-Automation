require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const profileRoutes = require("./routes/profileRoutes");
const alertRoutes = require("./routes/alertRoutes");
const pushRoutes = require("./routes/pushRoutes");

const { runAlertCheckCycle } = require("./services/alertMonitor");
const sendEmail = require("./utils/sendEmail");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);

app.use(helmet());
app.use(compression());

app.use(express.json());

// Guard database routes if DB connection is unavailable
app.use((req, res, next) => {
  const requiresDb =
    req.path.startsWith("/api/auth") ||
    req.path.startsWith("/api/profile") ||
    req.path.startsWith("/api/alerts");

  if (requiresDb && mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database is currently unavailable. Please ensure MongoDB is running or Atlas IP is whitelisted.",
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));



app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});



app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});



const PORT = process.env.PORT || 5000;



const ALERT_CHECK_INTERVAL_MS =
  Number(process.env.ALERT_CHECK_INTERVAL_MS) || 15 * 60 * 1000;



async function runAlertMonitor(label) {
  console.log("======================================");
  console.log(`[Monitor] ${label}`);
  console.log("======================================");

  try {
    const results = await runAlertCheckCycle();

    const triggered = results.filter(
      (result) => result.reached
    ).length;

    console.log("======================================");
    console.log(`Checked: ${results.length}`);
    console.log(`Triggered: ${triggered}`);
    console.log("======================================");
  } catch (error) {
    console.error("Alert check failed:", error);
  }
}



const server = app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  const connected = await connectDB();
  if (connected) {
    try {
      await sendEmail.verifyEmailTransporter();
    } catch (e) {
      console.warn("Email transporter verification:", e.message);
    }

    console.log(
      `Price alert monitor interval: ${
        ALERT_CHECK_INTERVAL_MS / 60000
      } minutes`
    );

    setTimeout(() => {
      runAlertMonitor("Initial price-alert check...");
    }, 5000);

    setInterval(() => {
      runAlertMonitor("Checking price alerts...");
    }, ALERT_CHECK_INTERVAL_MS);
  }
});

server.on("error", (error) => {
  console.error("Server listener error:", error.message);
});