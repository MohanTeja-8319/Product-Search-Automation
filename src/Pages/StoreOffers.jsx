import React from "react";

const StoreOffers = ({ comparison }) => {
  if (!comparison || comparison.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      {/* Header */}

      <div className="px-6 py-5 border-b border-gray-200">

        <h2 className="text-2xl font-bold">
          Store Offers
        </h2>

        <p className="text-gray-500 mt-1">
          Bank offers, coupons and cashback available
        </p>

      </div>

      <div className="p-6 space-y-5">

        {comparison.map((store) => (

          <div
            key={store.id}
            className="border border-gray-200 rounded-xl p-5 hover:border-purple-500 transition"
          >

            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-bold text-lg">

                  {store.store}

                </h3>

                <p className="text-gray-500 text-sm">

                  Extra savings available

                </p>

              </div>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

                Save More

              </span>

            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-5">

              <div className="bg-purple-50 rounded-lg p-4">

                💳 10% Instant Discount on HDFC Cards

              </div>

              <div className="bg-blue-50 rounded-lg p-4">

                💰 ₹1000 Cashback using UPI

              </div>

              <div className="bg-yellow-50 rounded-lg p-4">

                🎁 Exchange Bonus Available

              </div>

              <div className="bg-green-50 rounded-lg p-4">

                🚚 Free Delivery

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default StoreOffers;