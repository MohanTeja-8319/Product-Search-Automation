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
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5">
        <h2 className="text-xl sm:text-2xl font-bold">Customer Reviews</h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          What customers are saying
        </p>
      </div>

      <div className="p-4 sm:p-6">
        {/* Overall Rating */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl font-bold text-purple-600">
              4.7
            </h1>
            <p className="text-lg sm:text-xl mt-2">⭐⭐⭐⭐⭐</p>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Based on 3,426 reviews
            </p>
          </div>

          {/* Rating Bars */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {[
              { star: 5, percent: 82 },
              { star: 4, percent: 13 },
              { star: 3, percent: 3 },
              { star: 2, percent: 1 },
              { star: 1, percent: 1 },
            ].map((item) => (
              <div key={item.star} className="flex items-center gap-3 sm:gap-4">
                <span className="w-6 sm:w-8 text-sm sm:text-base">
                  {item.star}★
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 w-10 text-right">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">
                    {review.user}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm sm:text-base">
                      {"⭐".repeat(review.rating)}
                    </span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs sm:text-sm text-gray-500">
                  {review.date}
                </span>
              </div>

              <h4 className="font-bold mt-3 sm:mt-4 text-sm sm:text-base">
                {review.title}
              </h4>

              <p className="text-gray-600 mt-2 leading-6 sm:leading-7 text-sm sm:text-base">
                {review.review}
              </p>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-8">
          <button className="w-full sm:w-auto border border-purple-600 text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-purple-600 hover:text-white transition text-sm sm:text-base">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;