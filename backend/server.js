require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const profileRoutes = require("./routes/profileRoutes");
const alertRoutes = require("./routes/alertRoutes");
const pushRoutes = require("./routes/pushRoutes");

const { runAlertCheckCycle } = require("./services/alertMonitor");
const sendEmail = require("./utils/sendEmail");

const app = express();

/* ================================
   MIDDLEWARE
================================ */

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json());

/* ================================
   ROUTES
================================ */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));

/* ================================
   HEALTH CHECK
================================ */

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ================================
   404 HANDLER
================================ */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

/* ================================
   SERVER CONFIGURATION
================================ */

const PORT = process.env.PORT || 5000;

/*
  15 minutes = 15 × 60 × 1000
                  = 900000 ms

  If ALERT_CHECK_INTERVAL_MS exists
  in .env, it will use that value.

  Otherwise, default = 15 minutes.
*/

const ALERT_CHECK_INTERVAL_MS =
  Number(process.env.ALERT_CHECK_INTERVAL_MS) || 15 * 60 * 1000;

/* ================================
   ALERT MONITOR
================================ */

async function runAlertMonitor(label) {
  console.log("======================================");
  console.log(`🔎 ${label}`);
  console.log("======================================");

  try {
    const results = await runAlertCheckCycle();

    const triggered = results.filter(
      (result) => result.reached
    ).length;

    console.log("======================================");
    console.log(`📊 Checked: ${results.length}`);
    console.log(`🎯 Triggered: ${triggered}`);
    console.log("======================================");
  } catch (error) {
    console.error("❌ Alert check failed:", error);
  }
}

/* ================================
   START SERVER
================================ */

connectDB()
  .then(async () => {
    /* ------------------------------
       Start Express server
    ------------------------------ */

    app.listen(PORT, async () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );

      /* ------------------------------
         Check SMTP connection
      ------------------------------ */

      await sendEmail.verifyEmailTransporter();
    });

    /* ------------------------------
       Show alert interval
    ------------------------------ */

    console.log(
      `⏱️ Price alert monitor interval: ${
        ALERT_CHECK_INTERVAL_MS / 60000
      } minutes`
    );

    /* ------------------------------
       Initial check after 5 seconds
    ------------------------------ */

    setTimeout(() => {
      runAlertMonitor(
        "Initial price-alert check..."
      );
    }, 5000);

    /* ------------------------------
       Run every 15 minutes
    ------------------------------ */

    setInterval(() => {
      runAlertMonitor(
        "Checking price alerts..."
      );
    }, ALERT_CHECK_INTERVAL_MS);
  })
  .catch((error) => {
    console.error(
      "❌ Server startup failed:",
      error
    );

    process.exit(1);
  });