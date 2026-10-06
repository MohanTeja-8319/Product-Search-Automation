import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Specifications from "./Specifications";
import BankOffers from "./BankOffers";
import ReviewsSection from "./ReviewSection";
import FAQ from "./FAQ";
import RecentlyViewed from "./RecentlyViewed";
import ShareProduct from "./ShareProduct";
import StickyBuyBar from "./StickyBuyBar";
import RelatedProducts from "./RelatedProducts";
import WishlistButton from "../Components/WishlistButton";

import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import { syncUserData } from "../utils/api";
import { getDirectStoreUrl } from "../utils/storeHelper";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [inWishlist, setInWishlist] = useState(false);

  // Try to get product from navigation state (passed via navigate)
  const product = location.state?.product || null;

  useEffect(() => {
    if (product) {
      const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
      const updated = [
        product,
        ...recent.filter((p) => p.id !== product.id),
      ].slice(0, 8);
      localStorage.setItem("recentProducts", JSON.stringify(updated));
      if (localStorage.getItem("token"))
        syncUserData({ recentProducts: updated }).catch(() => {});
      setInWishlist(isProductInWishlist(product.name));
    }
  }, [product]);

  // If no product in state, redirect to comparison page (for UUID-style IDs) or search
  if (!product) {
    // If the id looks like a product name (comparison route), redirect there
    if (id && !Number(id)) {
      navigate(`/comparison/${encodeURIComponent(id)}`, { replace: true });
      return null;
    }
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Product Not Found</h1>
        <p className="text-gray-500">
          Please search for a product to view its details.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-[10px] font-semibold transition"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const rating = product.rating ?? product.ratings ?? 4.0;
  const reviews = product.reviews ?? product.reviewCount ?? 0;
  const price =
    typeof product.price === "number"
      ? product.price
      : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;
  const originalPrice =
    product.originalPrice ??
    product.mrp ??
    Math.round(price * 1.15);
  const discount =
    product.discount ??
    (originalPrice > price
      ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% off`
      : null);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800 transition-colors duration-200">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <button
              onClick={() => navigate(-1)}
              className="text-purple-600 font-semibold mb-4 sm:mb-6 hover:underline text-sm sm:text-base"
            >
              ← Back
            </button>

            {/* Main Product Card */}
            <div className="bg-white border border-gray-200 rounded-[10px] mt-6 p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                {/* Product Image */}
                <div className="flex justify-center items-center">
                  <img
                    src={product.image || product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="w-full max-w-xs sm:max-w-sm lg:w-96 object-contain"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />
                </div>

                {/* Product Info */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {product.name || product.title}
                  </h1>
                  <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    {product.brand || product.store || ""}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-5">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm sm:text-base">
                      ⭐ {typeof rating === "number" ? rating.toFixed(1) : rating}
                    </span>
                    {reviews > 0 && (
                      <span className="text-gray-500 text-sm sm:text-base">
                        ({reviews} Reviews)
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-purple-700 mt-4 sm:mt-6">
                    ₹{price.toLocaleString()}
                  </h2>

                  {originalPrice > price && (
                    <>
                      <p className="text-gray-400 line-through mt-2 text-sm sm:text-base">
                        ₹{originalPrice.toLocaleString()}
                      </p>
                      {discount && (
                        <span className="text-emerald-600 font-semibold text-sm sm:text-base">
                          {discount}
                        </span>
                      )}
                    </>
                  )}

                  <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-sm sm:text-base">
                    {product.brand && (
                      <p><strong>Brand:</strong> {product.brand}</p>
                    )}
                    {product.category && (
                      <p><strong>Category:</strong> {product.category}</p>
                    )}
                    {product.store && (
                      <p><strong>Store:</strong> {product.store}</p>
                    )}
                    {product.availability && (
                      <p><strong>Availability:</strong> {product.availability}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 items-center">
                    <button
                      onClick={() =>
                        window.open(
                          getDirectStoreUrl(product.store, product.name, product.url),
                          "_blank"
                        )
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 rounded-[10px] cursor-pointer text-sm sm:text-base font-semibold transition"
                    >
                      Buy Now
                    </button>
                    <WishlistButton
                      product={product}
                      size={44}
                      iconSize={16}
                      showText={true}
                      style={{ borderRadius: "10px", height: "46px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Specifications product={product} />
            <BankOffers />
            <ReviewsSection />
            <FAQ />
            <RelatedProducts products={[]} />
            <RecentlyViewed />
            <ShareProduct productName={product.name || product.title} />

            <footer className="mt-12 bg-white border border-gray-200 rounded-[10px]">
              <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="sm:col-span-2 md:col-span-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-purple-700">
                      Product Search
                    </h2>
                    <p className="text-gray-500 mt-4 text-sm sm:text-base">
                      Compare prices from trusted stores, view product details,
                      specifications, offers and make smarter buying decisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4 text-sm sm:text-base">Quick Links</h3>
                    <ul className="space-y-2 text-gray-500 text-sm sm:text-base">
                      <li className="hover:text-purple-600 cursor-pointer" onClick={() => navigate("/")}>Home</li>
                      <li className="hover:text-purple-600 cursor-pointer" onClick={() => navigate("/search")}>Search</li>
                      <li className="hover:text-purple-600 cursor-pointer" onClick={() => navigate("/wishlist")}>Wishlist</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4 text-sm sm:text-base">Support</h3>
                    <ul className="space-y-2 text-gray-500 text-sm sm:text-base">
                      <li className="hover:text-purple-600 cursor-pointer">Help Center</li>
                      <li className="hover:text-purple-600 cursor-pointer">Contact Us</li>
                      <li className="hover:text-purple-600 cursor-pointer">Privacy Policy</li>
                      <li className="hover:text-purple-600 cursor-pointer">Terms & Conditions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4 text-sm sm:text-base">Follow Us</h3>
                    <div className="flex gap-4 text-xl sm:text-2xl">
                      🐦 📘 📸
                    </div>
                  </div>
                </div>

                <div className="border-t mt-8 pt-6 text-center text-gray-500 text-xs sm:text-sm">
                  © 2026 Product Search Automation. All Rights Reserved.
                </div>
              </div>
            </footer>
          </div>
        </div>

        <StickyBuyBar
          productName={product.name || product.title}
          bestDeal={{
            price,
            store: product.store,
            image: product.image || product.imageUrl,
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetails;