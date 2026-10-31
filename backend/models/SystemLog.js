const mongoose = require("mongoose");

const systemLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      default: "system",
      trim: true,
    },
    dateTime: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
    severity: {
      type: String,
      enum: ["Critical", "Error", "Warning", "Info"],
      default: "Info",
    },
    status: {
      type: String,
      enum: ["Resolved", "Unresolved"],
      default: "Resolved",
    },
    stackTrace: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemLog", systemLogSchema);

