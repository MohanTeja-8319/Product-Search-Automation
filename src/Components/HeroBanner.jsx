import React from "react";

const HeroBanner = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#ecdfff] via-[#e5ebff] to-[#d6f0ff] rounded-3xl p-8 md:p-10 shadow-sm border border-indigo-100/20 overflow-hidden relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side: Content */}
        <div className="z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 leading-tight tracking-tight">
            Compare Prices.
            <br />
            Save More.
          </h1>
          <p className="text-gray-600 mt-4 max-w-sm text-sm md:text-base leading-relaxed">
            Compare product prices from top websites and get notified on price drops.
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl mt-6 shadow-md shadow-indigo-100 hover:shadow-lg transition duration-300">
            Start Comparing
          </button>
        </div>

        {/* Right Side: 3D-like Illustration */}
        <div className="relative w-full h-60 md:h-64 flex justify-center items-center">
          {/* Wavy line background decoration */}
          <svg className="absolute inset-0 w-full h-full text-indigo-300/30" fill="none" viewBox="0 0 400 200">
            <path
              d="M 10,120 C 100,60 120,160 220,100 C 300,50 350,130 390,90"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </svg>

          {/* Main 3D Cart and Box Composition */}
          <div className="relative scale-95 md:scale-105">
            {/* Cardboard Box */}
            <div className="absolute -top-4 left-7 z-10 w-16 h-14 bg-[#e5b37e] rounded-lg shadow-md border border-[#cb955e] transform -rotate-12 flex items-center justify-center">
              <div className="w-full h-2.5 bg-[#cb955e] opacity-40 absolute top-1/2 -translate-y-1/2"></div>
              <div className="w-2.5 h-full bg-[#cb955e] opacity-40 absolute left-1/2 -translate-x-1/2"></div>
            </div>

            {/* Shopping Cart (Navy Blue / Gray) */}
            <svg
              className="w-32 h-32 text-slate-800 drop-shadow-lg z-20 relative transform -scale-x-100 -rotate-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="9" cy="21" r="1.25" fill="currentColor" />
              <circle cx="20" cy="21" r="1.25" fill="currentColor" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
              />
            </svg>

            {/* Blue Percentage Discount Tag */}
            <div className="absolute bottom-6 right-3 z-30 bg-indigo-600 text-white font-bold text-xs px-2 py-1 rounded shadow-md transform rotate-12 flex items-center justify-center">
              <span>%</span>
            </div>

            {/* Floating Bubble: Rupee */}
            <div className="absolute -top-8 -left-6 z-30 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md border border-purple-500/20 transform hover:scale-110 transition duration-300">
              <span className="font-semibold text-base">₹</span>
            </div>

            {/* Floating Bubble: Bell */}
            <div className="absolute -top-6 right-2 z-30 w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-md border border-blue-400/20 transform hover:scale-110 transition duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
              </svg>
            </div>

            {/* Floating Bubble: Graph */}
            <div className="absolute top-8 -right-10 z-30 w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md border border-indigo-400/20 transform hover:scale-110 transition duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;