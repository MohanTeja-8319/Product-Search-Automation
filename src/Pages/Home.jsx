import React from "react";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import HeroBanner from "../Components/HeroBanner";
import StatsCards from "../Components/StatsCards";
import PopularDeals from "../Components/PopularDeals";
import PriceAlert from "../Components/PriceAlert";
import WatchList from "../Components/WatchList";
import Categories from "../Components/Categories";
import Footer from "../Components/Footer";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-72">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-8">

          {/* Hero Banner */}
          <HeroBanner />

          {/* Statistics Cards */}
          <div className="mt-8">
            <StatsCards />
          </div>

          {/* Popular Deals */}
          <div className="mt-10">
            <PopularDeals />
          </div>

          {/* Alerts & Watchlist */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

            <PriceAlert />

            <WatchList />

          </div>

          {/* Categories */}
          <div className="mt-10">
            <Categories />
          </div>

        </main>

        {/* Footer */}
        <Footer />

      </div>

    </div>
  );
};

export default Home;