


import React,{useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "./SideBar";
import TopNavbar from "./TopNavBar";
import Wishlist from "./AddWishlist";

import ProductInfo from "./ProductInfo";
import Specifications from "./Specifications";
import SummaryCards from "./SummaryCards";
import PriceHistory from "./PriceHistory";
import Recommendation from "./Recommendation";
import StoreOffers from "./StoreOffers";
import EMICalculator from "./EMICalaculator";
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

const ComparisonPage = () => {

    const navigate = useNavigate();



    const { productName } = useParams();

    const decodedName = decodeURIComponent(productName);

    const comparison = comparisonProducts[decodedName];

    if (!comparison) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <h1 className="text-3xl font-bold">
                    No Comparison Available
                </h1>
            </div>
        );
    }

    const bestDeal = comparison.reduce((best, current) =>
        current.price < best.price ? current : best
    );

    const lowestPrice = Math.min(
        ...comparison.map(item => item.price)
    );

    const highestPrice = Math.max(
        ...comparison.map(item => item.price)
    );

    const averagePrice = Math.round(
        comparison.reduce((sum, item) => sum + item.price, 0) /
        comparison.length
    );

    const savings = highestPrice - lowestPrice;

const currentProduct = {
    id: comparison[0]?.id,
    name: decodedName,
    image: bestDeal.image,
    price: bestDeal.price,
    rating: bestDeal.rating,
    discount: bestDeal.discount,
};
        
 
useEffect(() => {

    const recent =
        JSON.parse(localStorage.getItem("recentProducts")) || [];

    const updated = [
        currentProduct,
        ...recent.filter((p) => p.id !== currentProduct.id),
    ].slice(0, 8);

    localStorage.setItem(
        "recentProducts",
        JSON.stringify(updated)
    );

}, [currentProduct]);
    return (

        <div className="flex h-screen bg-[#f7f8fc] overflow-hidden">

            {/* Sidebar */}

            <div className="h-screen w-64 overflow-y-auto hide-scrollbar border-r bg-white">

                <Sidebar />

            </div>

            {/* Main */}

            <div className="flex-1 flex flex-col overflow-hidden">

                <TopNavbar />

                <div className="flex-1 overflow-y-auto hide-scrollbar pb-28">

                    <div className="max-w-7xl mx-auto px-8 py-6">

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

                        <Specifications
                            product={bestDeal}
                        />

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

                        <PriceHistory
                            comparison={comparison}
                        />

                        {/* Recommendation */}

                        <Recommendation
                            comparison={comparison}
                        />

                        {/* Store Offers */}

                        <StoreOffers
                            comparison={comparison}
                        />


                    

                                    <ComparisonTable
                                        comparison={comparison}
                                        lowestPrice={lowestPrice}
                                    />


                        {/* EMI */}

                        <EMICalculator
                            price={bestDeal.price}
                        />

                        {/* Price Alert */}

                        <PriceAlert
                            currentPrice={bestDeal.price}
                        />

                        {/* Reviews */}

                        <ReviewsSection />

                        {/* Related Products */}

                        <RelatedProducts
                            products={comparison}
                        />

                        {/* Bank Offers */}

                        <BankOffers />

                        {/* FAQ */}

                        <FAQ />
                                                {/* Recently Viewed */}

                        <RecentlyViewed
                            products={dummyProducts.slice(0, 8)}
                        />

                        {/* Share Product */}

                        
                        <ShareProduct
    productName={decodedName}
/>

<Wishlist
    productName={decodedName}
/>

                        {/* Footer */}

                        <div className="mt-10 border-t border-gray-200 pt-8 pb-8 text-center">

                            <h3 className="font-bold text-lg text-gray-800">
                                Product Search Automation
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Compare prices from multiple trusted stores and
                                choose the best deal.
                            </p>

                            <div className="flex justify-center gap-8 mt-6 text-sm text-gray-500">

                                <button className="hover:text-purple-600">
                                    Privacy Policy
                                </button>

                                <button className="hover:text-purple-600">
                                    Terms & Conditions
                                </button>

                                <button className="hover:text-purple-600">
                                    Contact Us
                                </button>

                                <button className="hover:text-purple-600">
                                    About
                                </button>

                            </div>

                            <p className="mt-6 text-gray-400 text-sm">
                                © 2026 Product Search Automation. All Rights Reserved.
                            </p>

                        </div>

                    </div>

                </div>

                {/* Sticky Buy Bar */}

                <StickyBuyBar
                    productName={decodedName}
                    bestDeal={bestDeal}
                />

            </div>

        </div>

    );

};

export default ComparisonPage;