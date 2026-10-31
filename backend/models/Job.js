const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    started: {
      type: String,
      default: () => new Date().toLocaleTimeString(),
    },
    duration: {
      type: String,
      default: "Running",
    },
    status: {
      type: String,
      enum: ["Completed", "Running", "Failed", "Cancelled"],
      default: "Running",
    },
    resultsCollected: {
      type: Number,
      default: 0,
    },
    logs: [
      {
        time: { type: String },
        text: { type: String },
        type: { type: String, default: "info" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);

