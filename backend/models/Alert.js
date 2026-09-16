const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.Mixed, // dummy catalog ids are numbers today
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
    targetPrice: {
      type: Number,
      required: [true, "Target price is required"],
    },
    initialPrice: {
      type: Number,
      default: 0,
    },
    store: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    notifyPriceDrop: {
      type: Boolean,
      default: true,
    },
    notifyStock: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: true,
    },
    push: {
      type: Boolean,
      default: true,
    },
    whatsapp: {
      type: Boolean,
      default: false,
    },
    emailAddress: {
      type: String,
      trim: true,
      default: "",
    },
    frequency: {
      type: String,
      enum: ["Instant", "Daily", "Weekly"],
      default: "Instant",
    },
    active: {
      type: Boolean,
      default: true,
    },
    triggeredAt: {
      type: Date,
      default: null,
    },
    // Last time the background monitor actually checked a live price for
    // this alert. Used to respect the Instant / Daily / Weekly frequency
    // without re-checking (and spending API credits) too often.
    lastCheckedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One alert per user per product — creating again just refreshes it.
alertSchema.index({ user: 1, productName: 1 }, { unique: true });

module.exports = mongoose.model("Alert", alertSchema);
