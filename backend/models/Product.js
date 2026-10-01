const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      enum: ["In Stock", "Limited Stock", "Out of Stock"],
      default: "In Stock",
    },
    platforms: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, default: 0 },
        inStock: { type: Boolean, default: true },
        url: { type: String, default: "" },
        rating: { type: Number, default: 4.5 },
      },
    ],
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    priceHistory: [
      {
        date: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    source: {
      type: String,
      default: "User Search",
    },
    searchQuery: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", brand: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
