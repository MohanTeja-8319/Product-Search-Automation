import React from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Samsung Galaxy S25",
    price: "₹72,999",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
  },
  {
    id: 2,
    name: "Dell XPS 15",
    price: "₹1,35,000",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=400",
  },
  {
    id: 3,
    name: "Boat Airdopes",
    price: "₹2,499",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
];

const WatchList = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold flex items-center gap-3">
          <FaHeart className="text-red-500" />
          My Watchlist
        </h2>

        <button className="text-indigo-600 font-semibold">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {products.map((item) => (

          <div
            key={item.id}
            className="flex items-center justify-between border rounded-xl p-4 hover:shadow-lg transition"
          >

            <div className="flex items-center gap-4">

              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
              />

              <div>

                <h3 className="font-bold">
                  {item.name}
                </h3>

                <p className="text-green-600 font-semibold mt-2">
                  {item.price}
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <button className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700">
                <FaShoppingCart />
              </button>

              <button className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600">
                <FaTrash />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default WatchList;