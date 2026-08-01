import React from "react";

const reviews = [
  {
    id: 1,
    user: "Rahul Sharma",
    rating: 5,
    title: "Excellent Product",
    review:
      "The product quality is amazing. Delivery was fast and packaging was perfect. Highly recommended.",
    verified: true,
    date: "2 days ago",
  },
  {
    id: 2,
    user: "Priya Verma",
    rating: 4,
    title: "Worth the Money",
    review:
      "Very good value for the price. Performance is excellent. I would definitely recommend it.",
    verified: true,
    date: "5 days ago",
  },
  {
    id: 3,
    user: "Arjun Patel",
    rating: 5,
    title: "Amazing Purchase",
    review:
      "One of the best purchases I've made recently. Everything works perfectly.",
    verified: true,
    date: "1 week ago",
  },
  {
    id: 4,
    user: "Sneha Reddy",
    rating: 4,
    title: "Satisfied",
    review:
      "Looks premium and performs well. Delivery was delayed by one day but product is excellent.",
    verified: false,
    date: "2 weeks ago",
  },
];

const ReviewsSection = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      {/* Header */}

      <div className="border-b border-gray-200 px-6 py-5">

        <h2 className="text-2xl font-bold">

          Customer Reviews

        </h2>

        <p className="text-gray-500 mt-1">

          What customers are saying

        </p>

      </div>

      <div className="p-6">

        {/* Overall Rating */}

        <div className="grid lg:grid-cols-3 gap-10">

          <div>

            <h1 className="text-6xl font-bold text-purple-600">

              4.7

            </h1>

            <p className="text-xl mt-2">

              ⭐⭐⭐⭐⭐

            </p>

            <p className="text-gray-500 mt-2">

              Based on 3,426 reviews

            </p>

          </div>

          {/* Rating Bars */}

          <div className="lg:col-span-2 space-y-4">

            {[
              { star: 5, percent: 82 },
              { star: 4, percent: 13 },
              { star: 3, percent: 3 },
              { star: 2, percent: 1 },
              { star: 1, percent: 1 },
            ].map((item) => (

              <div
                key={item.star}
                className="flex items-center gap-4"
              >

                <span className="w-8">

                  {item.star}★

                </span>

                <div className="flex-1 bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-yellow-400 h-3 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />

                </div>

                <span className="text-sm text-gray-500">

                  {item.percent}%

                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Reviews */}

        <div className="mt-10 space-y-6">

          {reviews.map((review) => (

            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-5"
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="font-semibold">

                    {review.user}

                  </h3>

                  <div className="flex items-center gap-2 mt-1">

                    <span>

                      {"⭐".repeat(review.rating)}

                    </span>

                    {review.verified && (

                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">

                        Verified Buyer

                      </span>

                    )}

                  </div>

                </div>

                <span className="text-sm text-gray-500">

                  {review.date}

                </span>

              </div>

              <h4 className="font-bold mt-4">

                {review.title}

              </h4>

              <p className="text-gray-600 mt-2 leading-7">

                {review.review}

              </p>

            </div>

          ))}

        </div>

        {/* Button */}

        <div className="text-center mt-8">

          <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-600 hover:text-white transition">

            Load More Reviews

          </button>

        </div>

      </div>

    </div>
  );
};

export default ReviewsSection;