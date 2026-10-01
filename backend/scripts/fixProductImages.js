const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/product_search_automation";

async function fixImages() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB to fix product images...");

  const images = {
    "Apple iPhone 16 (128GB, Teal)": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80",
    "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=80",
    "Sony WH-1000XM5 Wireless Noise Cancelling Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    "Apple MacBook Air M3 (13.6-inch, 16GB RAM, 512GB SSD)": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80",
    "Nike Air Max 270 Running Shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
    "Apple MacBook Neo": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80",
  };

  const prods = await mongoose.connection.db.collection("products").find({}).toArray();
  for (const p of prods) {
    let img = images[p.title];
    if (!img) {
      if (p.title.includes("OnePlus")) img = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80";
      else if (p.title.includes("MacBook")) img = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80";
      else if (p.title.includes("iPhone")) img = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80";
      else img = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80";
    }
    await mongoose.connection.db.collection("products").updateOne({ _id: p._id }, { $set: { image: img } });
    console.log("Updated image for:", p.title);
  }

  await mongoose.disconnect();
  console.log("All product images updated successfully!");
}

fixImages().catch(console.error);
