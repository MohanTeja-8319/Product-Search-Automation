import React from "react";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import HeroBanner from "../Components/HeroBanner";
import StatsCards from "../Components/StatsCards";
import PopularDeals from "../Components/PopularDeals";
import PriceAlert from "../Components/PriceAlert";
import WatchList from "../Components/WatchList";
import Categories from "../Components/Categories";
import FeaturesBar from "../Components/FeaturesBar";

const Home = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Page Grid Content */}
        <main className="p-6 flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            {/* Left Main Column (75% width on large screens) */}
            <div className="xl:col-span-3 space-y-6">
              <HeroBanner />
              <StatsCards />
              <PopularDeals />
              <Categories />
              <FeaturesBar />
            </div>

            {/* Right Alerts/Watchlist Column (25% width on large screens) */}
            <div className="xl:col-span-1 space-y-6">
              <PriceAlert />
              <WatchList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;