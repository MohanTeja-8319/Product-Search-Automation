require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
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



connectDB()
  .then(async () => {
    

    app.listen(PORT, async () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );

      

      await sendEmail.verifyEmailTransporter();
    });

    

    console.log(
      `Price alert monitor interval: ${
        ALERT_CHECK_INTERVAL_MS / 60000
      } minutes`
    );

    

    setTimeout(() => {
      runAlertMonitor(
        "Initial price-alert check..."
      );
    }, 5000);

    

    setInterval(() => {
      runAlertMonitor(
        "Checking price alerts..."
      );
    }, ALERT_CHECK_INTERVAL_MS);
  })
  .catch((error) => {
    console.error(
      "Server startup failed:",
      error
    );

    process.exit(1);
  });