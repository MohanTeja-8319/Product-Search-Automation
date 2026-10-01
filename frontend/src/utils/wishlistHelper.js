import { syncUserData } from "./api";

/**
 * Retrieve wishlist array safely from localStorage.
 */
export const getWishlist = () => {
  const stored = localStorage.getItem("wishlistItems");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && (item.name || item.title));
  } catch (e) {
    return [];
  }
};

/**
 * Check if a product is in the wishlist.
 */
export const isProductInWishlist = (productName) => {
  if (!productName) return false;
  const list = getWishlist();
  const target = String(productName).trim().toLowerCase();
  return list.some(item => (item?.name || item?.title || "").trim().toLowerCase() === target);
};

/**
 * Toggle a product in/out of the wishlist.
 */
export const toggleWishlistItem = (product) => {
  if (!product || (!product.name && !product.title)) {
    return { added: false, wishlist: getWishlist() };
  }

  const pName = String(product.name || product.title).trim();
  let wishlist = getWishlist();
  const exists = wishlist.some(
    item => (item?.name || item?.title || "").trim().toLowerCase() === pName.toLowerCase()
  );

  if (exists) {
    wishlist = wishlist.filter(
      item => (item?.name || item?.title || "").trim().toLowerCase() !== pName.toLowerCase()
    );
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
    if (localStorage.getItem("token")) {
      syncUserData({ wishlist }).catch(() => {});
    }
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { added: false, product } }));
    return { added: false, wishlist };
  } else {
    const newItem = {
      id: product.id || Date.now(),
      name: pName,
      category: product.category || "General",
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
      targetPrice: Math.round((Number(product.price) || 0) * 0.9),
      discount: product.discount || "",
      image: product.image || "",
      rating: product.rating || null,
      store: product.store || "Amazon",
      url: product.url || "",
      logoText: (product.store || "Amazon")[0].toLowerCase(),
      logoBg: (product.store || "Amazon") === "Amazon" ? "bg-black text-white font-serif" : "bg-blue-600 text-yellow-400 font-extrabold",
      lastUpdated: "Just now"
    };
    wishlist.unshift(newItem);
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
    if (localStorage.getItem("token")) {
      syncUserData({ wishlist }).catch(() => {});
    }
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { added: true, product: newItem } }));
    return { added: true, wishlist };
  }
};

/**
 * Remove an item from the wishlist by product name.
 */
export const removeWishlistItem = (productName) => {
  if (!productName) return [];
  const target = String(productName).trim().toLowerCase();
  let wishlist = getWishlist().filter(
    item => (item?.name || item?.title || "").trim().toLowerCase() !== target
  );
  localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
  if (localStorage.getItem("token")) {
    syncUserData({ wishlist }).catch(() => {});
  }
  window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { removedName: productName } }));
  return wishlist;
};
