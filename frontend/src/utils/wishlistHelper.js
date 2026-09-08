export const toggleWishlistItem = (product) => {
  const stored = localStorage.getItem("wishlistItems");
  let wishlist = [];
  if (stored) {
    try {
      wishlist = JSON.parse(stored);
    } catch (e) {
      // Ignore
    }
  }
  const exists = wishlist.some((item) => item.name.toLowerCase() === product.name.toLowerCase());
  if (exists) {
    wishlist = wishlist.filter((item) => item.name.toLowerCase() !== product.name.toLowerCase());
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
    return { added: false, wishlist };
  } else {
    const newItem = {
      id: Date.now(),
      name: product.name,
      category: product.category || "General",
      price: product.price || 0,
      targetPrice: Math.round((product.price || 0) * 0.9),
      drop: product.discount || "5%",
      image: product.image,
      store: product.store || "Amazon",
      logoText: (product.store || "Amazon")[0].toLowerCase(),
      logoBg: (product.store || "Amazon") === "Amazon" ? "bg-black text-white font-serif" : "bg-blue-600 text-yellow-400 font-extrabold",
      lastUpdated: "Just now"
    };
    wishlist.push(newItem);
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
    return { added: true, wishlist };
  }
};

export const isProductInWishlist = (productName) => {
  const stored = localStorage.getItem("wishlistItems");
  if (!stored) return false;
  try {
    const wishlist = JSON.parse(stored);
    return wishlist.some((item) => item.name.toLowerCase() === productName.toLowerCase());
  } catch (e) {
    return false;
  }
};
