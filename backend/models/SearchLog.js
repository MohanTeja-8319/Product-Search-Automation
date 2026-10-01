const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    user: {
      type: String,
      default: "Storefront Guest",
    },
    userEmail: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    platforms: {
      type: Number,
      default: 4,
    },
    platformList: {
      type: String,
      default: "Amazon, Flipkart, Myntra, Croma",
    },
    productsFound: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: "1.2s",
    },
    status: {
      type: String,
      enum: ["Completed", "Running", "Failed"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

searchLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("SearchLog", searchLogSchema);
