const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/product_search_automation";

async function cleanImages() {
  await mongoose.connect(MONGO_URI);
  const collection = mongoose.connection.db.collection("products");
  const prods = await collection.find({}).toArray();
  let updated = 0;
  for (const p of prods) {
    if (!p.image || p.image.includes("encrypted-tbn") || p.image.includes("images?q=tbn")) {
      let newImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80";
      const titleLower = (p.title || "").toLowerCase();
      if (titleLower.includes("shoe") || titleLower.includes("nike")) {
        newImg = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80";
      } else if (titleLower.includes("phone") || titleLower.includes("oneplus") || titleLower.includes("galaxy") || titleLower.includes("s24") || titleLower.includes("iphone")) {
        newImg = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80";
      } else if (titleLower.includes("macbook") || titleLower.includes("laptop")) {
        newImg = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80";
      } else if (titleLower.includes("headphone") || titleLower.includes("sony") || titleLower.includes("audio")) {
        newImg = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80";
      }
      await collection.updateOne({ _id: p._id }, { $set: { image: newImg } });
      updated++;
    }
  }
  console.log("Cleaned and updated products:", updated);
  await mongoose.disconnect();
}

cleanImages().catch(console.error);
