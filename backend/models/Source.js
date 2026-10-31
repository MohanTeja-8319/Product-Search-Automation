const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Enabled", "Disabled"],
      default: "Enabled",
    },
    productsCollected: {
      type: Number,
      default: 0,
    },
    lastSync: {
      type: String,
      default: "Just now",
    },
    successRate: {
      type: Number,
      default: 98.0,
    },
    syncInterval: {
      type: String,
      default: "15 min",
    },
    apiType: {
      type: String,
      default: "QuickCommerce API Gateway",
    },
    endpoint: {
      type: String,
      default: "",
    },
    rateLimit: {
      type: String,
      default: "60 req / min",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Source", sourceSchema);

