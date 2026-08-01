import React from "react";

const offers = [
  {
    id: 1,
    title: "10% Instant Discount",
    subtitle: "HDFC Bank Credit Card",
    color: "bg-purple-50",
    icon: "💳",
  },
  {
    id: 2,
    title: "₹1000 Cashback",
    subtitle: "Pay using UPI",
    color: "bg-green-50",
    icon: "💰",
  },
  {
    id: 3,
    title: "No Cost EMI",
    subtitle: "Up to 12 Months",
    color: "bg-blue-50",
    icon: "📅",
  },
  {
    id: 4,
    title: "Exchange Bonus",
    subtitle: "Up to ₹5000 Off",
    color: "bg-yellow-50",
    icon: "🔄",
  },
  {
    id: 5,
    title: "Free Delivery",
    subtitle: "Delivered in 2 Days",
    color: "bg-pink-50",
    icon: "🚚",
  },
  {
    id: 6,
    title: "Flat ₹1500 Coupon",
    subtitle: "Code: SAVE1500",
    color: "bg-indigo-50",
    icon: "🏷️",
  },
];

const BankOffers = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      <div className="px-6 py-5 border-b">

        <h2 className="text-2xl font-bold">

          Bank Offers & Coupons

        </h2>

        <p className="text-gray-500 mt-1">

          Save more with exclusive payment offers.

        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">

        {offers.map((offer) => (

          <div
            key={offer.id}
            className={`${offer.color} rounded-xl p-5 border hover:shadow-md transition`}
          >

            <div className="text-4xl">

              {offer.icon}

            </div>

            <h3 className="font-bold text-lg mt-4">

              {offer.title}

            </h3>

            <p className="text-gray-600 mt-2">

              {offer.subtitle}

            </p>

            <button className="mt-5 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition">

              Apply Offer

            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default BankOffers;