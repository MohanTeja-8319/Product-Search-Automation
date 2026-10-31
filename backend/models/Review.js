const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    store: {
      type: String,
      default: "Amazon",
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    comment: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Approved", "Flagged"],
      default: "Approved",
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Positive",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

