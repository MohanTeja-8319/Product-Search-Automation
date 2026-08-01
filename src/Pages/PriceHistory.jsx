import React from "react";

const PriceHistory = ({ comparison }) => {
  if (!comparison || comparison.length === 0) return null;

  const prices = comparison.map((item) => item.price);

  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);

  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold">

          Price Analysis

        </h2>

        <span className="text-sm text-gray-500">

          Store Price Comparison

        </span>

      </div>

      {/* Graph */}

      <div className="flex items-end justify-around h-72 border-b border-l border-gray-300 pb-4">

        {comparison.map((item) => {

          const height =
            ((item.price - lowest) / (highest - lowest || 1)) * 180 + 40;

          return (

            <div
              key={item.id}
              className="flex flex-col items-center"
            >

              <div className="text-xs text-gray-600 mb-2">

                ₹{item.price.toLocaleString()}

              </div>

              <div
                className={`w-14 rounded-t-lg transition-all duration-300 hover:scale-105 ${
                  item.price === lowest
                    ? "bg-green-500"
                    : "bg-purple-600"
                }`}
                style={{
                  height: `${height}px`,
                }}
              ></div>

              <div className="mt-3 text-sm font-medium">

                {item.store}

              </div>

            </div>

          );

        })}
      </div>

      {/* Legend */}

      <div className="grid grid-cols-3 gap-5 mt-8">

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">

          <p className="text-gray-500 text-sm">

            Lowest Price

          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">

            ₹{lowest.toLocaleString()}

          </h2>

        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">

          <p className="text-gray-500 text-sm">

            Highest Price

          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">

            ₹{highest.toLocaleString()}

          </h2>

        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">

          <p className="text-gray-500 text-sm">

            Difference

          </p>

          <h2 className="text-2xl font-bold text-purple-700 mt-2">

            ₹{(highest - lowest).toLocaleString()}

          </h2>

        </div>

      </div>

    </div>
  );
};

export default PriceHistory;