const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS configuration errors
}

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/product_search_automation";
  const dbName = process.env.DB_NAME || "product_search_automation";

  // Try the configured primary URI
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`Primary MongoDB connection failed: ${err.message}`);
  }

  // If primary fails and was not local, try local MongoDB fallback
  const localUri = "mongodb://127.0.0.1:27017/product_search_automation";
  if (uri !== localUri) {
    try {
      console.log("Attempting fallback connection to local MongoDB (127.0.0.1:27017)...");
      await mongoose.connect(localUri, {
        dbName,
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`MongoDB connected via local fallback: ${mongoose.connection.host}`);
      return true;
    } catch (localErr) {
      console.error(`Local MongoDB fallback connection failed: ${localErr.message}`);
    }
  }

  console.error("Warning: Could not connect to any MongoDB instance. Ensure MongoDB is running or Atlas IP is whitelisted.");
  return false;
}

module.exports = connectDB;

