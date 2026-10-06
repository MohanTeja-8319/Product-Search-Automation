const dns = require("dns");
const mongoose = require("mongoose");

let isConnecting = false;
let retryTimer = null;

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

function scheduleReconnect() {
  if (retryTimer || mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) return;
  retryTimer = setTimeout(async () => {
    retryTimer = null;
    await connectDB();
  }, 5000);
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) return true;
  if (isConnecting) return false;

  isConnecting = true;
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/product_search_automation";
  const dbName = process.env.DB_NAME || "product_search_automation";
  const connectOptions = {
    dbName,
    serverSelectionTimeoutMS: 5000,
    family: 4,
  };

  async function tryConnect(targetUri, label) {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect().catch(() => {});
      }
      console.log(label);
      await mongoose.connect(targetUri, connectOptions);
      return true;
    } catch (err) {
      console.warn(`${label} failed: ${err.message}`);
      return false;
    }
  }

  try {
    if (await tryConnect(uri, "Connecting to MongoDB...")) {
      return true;
    }

    if (uri.startsWith("mongodb+srv://")) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      if (await tryConnect(uri, "Retrying MongoDB connection with public DNS servers (8.8.8.8)...")) {
        return true;
      }
    }

    const localUri = "mongodb://127.0.0.1:27017/product_search_automation";
    if (uri !== localUri) {
      if (await tryConnect(localUri, "Attempting fallback connection to local MongoDB (127.0.0.1:27017)...")) {
        return true;
      }
    }

    console.warn("[DB] Could not connect to MongoDB Atlas or local MongoDB. Running in fault-tolerant mode using in-memory live catalog.");
    return false;
  } finally {
    isConnecting = false;
  }
}

module.exports = connectDB;

