import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import ProductInfo from "./ProductInfo";
import Specifications from "./Specifications";
import BankOffers from "./BankOffers";
import ReviewsSection from "./ReviewSection";
import FAQ from "./FAQ";
import RecentlyViewed from "./RecentlyViewed";
import ShareProduct from "./ShareProduct";
import Wishlist from "./AddWishlist";
import StickyBuyBar from "./StickyBuyBar";
import RelatedProducts from "./RelatedProducts";

import dummyProducts from "../data/products";
import comparisonProducts from "../data/comparisionProducts";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inWishlist, setInWishlist] = useState(false);

  const product = dummyProducts.find(
    (item) => item.id === Number(id)
  );

  const hasComparison =
    comparisonProducts[product?.name] &&
    comparisonProducts[product.name].length > 0;

  useEffect(() => {
    if (product) {
      const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
      const updated = [
        product,
        ...recent.filter((p) => p.id !== product.id),
      ].slice(0, 8);
      localStorage.setItem("recentProducts", JSON.stringify(updated));
      setInWishlist(isProductInWishlist(product.name));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  const relatedProducts = dummyProducts
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 pb-28">
          <div className="max-w-7xl mx-auto px-8 py-6">
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="text-purple-600 font-semibold mb-6 hover:underline"
            >
              ← Back
            </button>

            {!hasComparison && (
              <div className="mb-6 bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-yellow-800">
                    ⚠ No Comparison Available
                  </h2>
                  <p className="text-sm text-yellow-700 mt-1">
                    This product is currently available from only one store.
                    Price comparison is not available yet.
                  </p>
                </div>
              </div>
            )}

            {/* Product Card */}
            <div className="bg-white border border-gray-200 rounded-xl mt-6 p-8">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Left */}
                <div className="flex justify-center items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-96 object-contain"
                  />
                </div>

                {/* Right */}
                <div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <p className="text-gray-500 mt-2">{product.brand}</p>
                  <div className="flex items-center gap-3 mt-5">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                      ⭐ {product.rating}
                    </span>
                    <span className="text-gray-500">
                      ({product.reviews} Reviews)
                    </span>
                  </div>

                  <h2 className="text-4xl font-bold text-purple-700 mt-6">
                    ₹{product.price.toLocaleString()}
                  </h2>

                  <p className="text-gray-400 line-through mt-2">
                    ₹{product.originalPrice.toLocaleString()}
                  </p>

                  <span className="text-green-600 font-semibold">
                    {product.discount}
                  </span>

                  <div className="mt-8 space-y-3">
                    <p>
                      <strong>Brand:</strong> {product.brand}
                    </p>
                    <p>
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p>
                      <strong>Store:</strong> {product.store}
                    </p>
                    <p>
                      <strong>Availability:</strong> {product.availability}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => window.open(product.url || "https://amazon.in", "_blank")}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg cursor-pointer"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => {
                        const { added } = toggleWishlistItem(product);
                        setInWishlist(added);
                      }}
                      className={`px-8 py-3 rounded-lg cursor-pointer font-semibold transition ${
                        inWishlist
                          ? "bg-red-500 text-white hover:bg-red-600 border border-red-500"
                          : "border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                      }`}
                    >
                      {inWishlist ? "❤️ Saved" : "♡ Add to Wishlist"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <Specifications product={product} />

            {/* Bank Offers */}
            <BankOffers />

            {/* Reviews */}
            <ReviewsSection />

            {/* FAQ */}
            <FAQ />

            {/* Related Products */}
            <RelatedProducts products={relatedProducts} />

            {/* Recently Viewed */}
            <RecentlyViewed products={dummyProducts.slice(0, 8)} />

            {/* Share Product */}
            <ShareProduct productName={product.name} />

            {/* Wishlist */}
            <Wishlist productName={product.name} />

            {/* Footer */}
            <footer className="mt-12 bg-white border border-gray-200 rounded-xl">
              <div className="px-8 py-10">
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-700">
                      Product Search
                    </h2>
                    <p className="text-gray-500 mt-4">
                      Compare prices from trusted stores, view product details,
                      specifications, offers and make smarter buying decisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-500">
                      <li className="hover:text-purple-600 cursor-pointer">
                        Home
                      </li>
                      <li className="hover:text-purple-600 cursor-pointer">
                        Categories
                      </li>
                      <li className="hover:text-purple-600 cursor-pointer">
                        Comparison
                      </li>
                      <li className="hover:text-purple-600 cursor-pointer">
                        Wishlist
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-500">
                      <li className="hover:text-purple-600 cursor-pointer">
                        Help Center
                      </li>
                      <li className="hover:text-purple-600 cursor-pointer">
                        Contact Us
                      </li>
                      <li className="hover:text-purple-600 cursor-pointer">
                        Privacy Policy
                      </li>
                      <li className="hover:text-purple-600 cursor-pointer">
                        Terms & Conditions
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4">Follow Us</h3>
                    <div className="flex gap-4 text-2xl">
                      📘 📸 🐦 💼
                    </div>
                  </div>
                </div>

                <div className="border-t mt-8 pt-6 text-center text-gray-500">
                  © 2026 Product Search Automation. All Rights Reserved.
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Sticky Buy Bar */}
        <StickyBuyBar
          productName={product.name}
          bestDeal={{
            price: product.price,
            store: product.store,
            image: product.image,
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetails;