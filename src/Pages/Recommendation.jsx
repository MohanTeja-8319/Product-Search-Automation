import React from "react";

const Recommendation = ({ comparison }) => {
  if (!comparison || comparison.length === 0) return null;

  const bestDeal = comparison.reduce((best, current) =>
    current.price < best.price ? current : best
  );

  const averageRating =
    (
      comparison.reduce((sum, item) => sum + item.rating, 0) /
      comparison.length
    ).toFixed(1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      {/* Header */}

      <div className="border-b border-gray-200 px-6 py-5">

        <h2 className="text-2xl font-bold">

          Buying Recommendation

        </h2>

        <p className="text-gray-500 mt-1">

          Our recommendation based on price and ratings.

        </p>

      </div>

      {/* Body */}

      <div className="p-6">

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">

          <div className="flex items-center gap-3">

            <div className="text-4xl">

              🏆

            </div>

            <div>

              <h3 className="text-xl font-bold text-green-700">

                Best Overall Choice

              </h3>

              <p className="text-gray-600">

                <strong>{bestDeal.store}</strong> offers the lowest price
                while maintaining excellent customer ratings.

              </p>

            </div>

          </div>

        </div>

        {/* Pros & Cons */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {/* Pros */}

          <div className="border border-green-200 rounded-xl p-5 bg-green-50">

            <h3 className="text-lg font-bold text-green-700 mb-4">

              Pros

            </h3>

            <ul className="space-y-3">

              <li>✔ Lowest available price</li>

              <li>✔ High customer ratings</li>

              <li>✔ Trusted online seller</li>

              <li>✔ Product available in stock</li>

              <li>✔ Good discount available</li>

            </ul>

          </div>

          {/* Cons */}

          <div className="border border-red-200 rounded-xl p-5 bg-red-50">

            <h3 className="text-lg font-bold text-red-700 mb-4">

              Things to Consider

            </h3>

            <ul className="space-y-3">

              <li>• Prices may change daily</li>

              <li>• Discounts depend on offers</li>

              <li>• Delivery varies by location</li>

              <li>• Exchange offers differ by store</li>

              <li>• Bank offers may reduce price further</li>

            </ul>

          </div>

        </div>

        {/* Recommendation */}

        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">

          <h3 className="text-xl font-bold text-purple-700">

            Final Recommendation

          </h3>

          <p className="mt-3 leading-8 text-gray-700">

            We recommend purchasing this product from{" "}
            <strong>{bestDeal.store}</strong> because it currently
            provides the best value for money with the lowest price,
            excellent customer ratings (average {averageRating}⭐),
            and attractive discounts. If additional bank offers or
            coupons are available, your final purchase price could
            be even lower.

          </p>

        </div>

      </div>

    </div>
  );
};

export default Recommendation;