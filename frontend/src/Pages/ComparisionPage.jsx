import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { AddWishlistWidget as Wishlist } from "./Wishlist";

import ProductInfo from "./ProductInfo";
import Specifications from "./Specifications";
import SummaryCards from "./SummaryCards";
import PriceHistory from "./PriceHistory";
import Recommendation from "./Recommendation";
import StoreOffers from "./StoreOffers";
import PriceAlert from "./PriceAlert";
import ReviewsSection from "./ReviewSection";
import RelatedProducts from "./RelatedProducts";
import BankOffers from "./BankOffers";
import FAQ from "./FAQ";
import RecentlyViewed from "./RecentlyViewed";
import ShareProduct from "./ShareProduct";
import StickyBuyBar from "./StickyBuyBar";
import ComparisonTable from "./ComparisionTable";

import comparisonProducts from "../data/comparisionProducts";
import dummyProducts from "../data/products";
import { getLiveComparison } from "../utils/api";

const ComparisonPage = () => {
  const navigate = useNavigate();
  const { productName } = useParams();

  const decodedName = decodeURIComponent(productName);
  const staticComparison = comparisonProducts[decodedName];
  const [liveComparison, setLiveComparison] = React.useState(null);
  const [loadingLiveComparison, setLoadingLiveComparison] = React.useState(!staticComparison);
  const [liveComparisonError, setLiveComparisonError] = React.useState("");

  useEffect(() => {
    let cancelled = false;

    if (staticComparison?.length) {
      setLoadingLiveComparison(false);
      return undefined;
    }

    setLoadingLiveComparison(true);
    getLiveComparison(decodedName)
      .then((response) => {
        if (!cancelled) {
          const liveItems = response?.product?.comparison || [];
          if (liveItems.length > 0) {
            setLiveComparison(liveItems);
          } else {
            setLiveComparison(null);
            setLiveComparisonError(
              "No deals found for this product across our supported stores."
            );
          }
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLiveComparisonError(error.message || "Unable to load live comparison.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingLiveComparison(false);
      });

    return () => {
      cancelled = true;
    };
  }, [decodedName, staticComparison]);

  const comparison = staticComparison?.length ? staticComparison : liveComparison;

  useEffect(() => {
    if (comparison && comparison.length > 0) {
      const bestDeal = comparison.reduce((best, current) =>
        current.price < best.price ? current : best
      );
      const currentProduct = {
        id: comparison[0]?.id,
        name: decodedName,
        image: bestDeal.image,
        price: bestDeal.price,
        rating: bestDeal.rating,
        discount: bestDeal.discount,
      };

      const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
      const updated = [
        currentProduct,
        ...recent.filter((p) => p.id !== currentProduct.id),
      ].slice(0, 8);

      localStorage.setItem("recentProducts", JSON.stringify(updated));
    }
  }, [comparison, decodedName]);

  if (loadingLiveComparison) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 text-center">
        <div>
          <div className="text-2xl font-bold">Loading live comparison…</div>
          <p className="text-sm text-slate-500 mt-2">Checking Amazon, Flipkart and Myntra.</p>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 text-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">No Comparison Available</h1>
          <p className="text-sm text-slate-500 mt-2">{liveComparisonError || "This product is not available from multiple stores."}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const bestDeal = comparison.reduce((best, current) =>
    current.price < best.price ? current : best
  );

  const lowestPrice = Math.min(...comparison.map((item) => item.price));
  const highestPrice = Math.max(...comparison.map((item) => item.price));
  const averagePrice = Math.round(
    comparison.reduce((sum, item) => sum + item.price, 0) / comparison.length
  );
  const savings = highestPrice - lowestPrice;

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen text-gray-800 dark:text-slate-100 transition-colors duration-200 relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="text-purple-600 font-semibold mb-6 hover:underline"
            >
              ← Back to Search
            </button>

            {/* Product Information */}
            <ProductInfo
              productName={decodedName}
              image={bestDeal.image}
              bestStore={bestDeal.store}
              rating={bestDeal.rating}
              lowestPrice={lowestPrice}
              highestPrice={highestPrice}
              averagePrice={averagePrice}
              savings={savings}
            />

            {/* Specifications */}
            <Specifications product={bestDeal} />

            {/* Summary */}
            <SummaryCards
              comparison={comparison}
              lowestPrice={lowestPrice}
              highestPrice={highestPrice}
              averagePrice={averagePrice}
              savings={savings}
              bestDeal={bestDeal}
            />

            {/* Price History */}
            <PriceHistory comparison={comparison} />

            {/* Recommendation */}
            <Recommendation comparison={comparison} />

            {/* Store Offers */}
            <StoreOffers comparison={comparison} />

            <ComparisonTable
              comparison={comparison}
              lowestPrice={lowestPrice}
            />


            {/* Price Alert */}
            <PriceAlert currentPrice={bestDeal.price} />

            {/* Reviews */}
            <ReviewsSection />

            {/* Related Products */}
            <RelatedProducts products={comparison} />

            {/* Bank Offers */}
            <BankOffers />

            {/* FAQ */}
            <FAQ />

            {/* Recently Viewed */}
            <RecentlyViewed products={dummyProducts.slice(0, 8)} />

            {/* Share Product */}
            <ShareProduct productName={decodedName} />

            <Wishlist productName={decodedName} />

            {/* Footer */}
            <div className="mt-10 border-t border-gray-200 dark:border-slate-800 pt-8 pb-8 text-center">
              <h3 className="font-bold text-lg text-gray-800">
                Product Search Automation
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mt-2 px-4">
                Compare prices from multiple trusted stores and choose the best
                deal.
              </p>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-8 mt-6 px-4 text-sm text-gray-500 dark:text-slate-400">
                <button className="hover:text-purple-600">Privacy Policy</button>
                <button className="hover:text-purple-600">
                  Terms & Conditions
                </button>
                <button className="hover:text-purple-600">Contact Us</button>
                <button className="hover:text-purple-600">About</button>
              </div>

              <p className="mt-6 text-gray-400 text-sm">
                © 2026 Product Search Automation. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Buy Bar */}
        <StickyBuyBar productName={decodedName} bestDeal={bestDeal} />
      </div>
    </div>
  );
};

export default ComparisonPage;