import React from "react";
import {
  FaBell,
  FaArrowDown,
  FaCheckCircle,
} from "react-icons/fa";

const alerts = [
  {
    id: 1,
    product: "Apple MacBook Air M3",
    price: "₹98,499",
    drop: "₹4,000",
    status: "Price Dropped",
  },
  {
    id: 2,
    product: "iPhone 16 Pro",
    price: "₹1,19,999",
    drop: "₹2,500",
    status: "Price Dropped",
  },
  {
    id: 3,
    product: "Sony WH-1000XM5",
    price: "₹24,999",
    drop: "₹1,200",
    status: "Available",
  },
];

const PriceAlert = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <FaBell className="text-yellow-500" />
          Price Alerts
        </h2>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Add Alert
        </button>
      </div>

      <div className="space-y-5">

        {alerts.map((item) => (

          <div
            key={item.id}
            className="flex justify-between items-center border rounded-xl p-4 hover:shadow-md transition"
          >

            <div>

              <h3 className="font-semibold text-lg">
                {item.product}
              </h3>

              <p className="text-gray-500">
                Current Price
              </p>

              <h4 className="text-green-600 font-bold">
                {item.price}
              </h4>

            </div>

            <div className="text-right">

              <div className="flex items-center gap-2 text-red-500 justify-end">
                <FaArrowDown />
                {item.drop}
              </div>

              <div className="flex items-center gap-2 mt-2 text-green-600 justify-end">
                <FaCheckCircle />
                {item.status}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default PriceAlert;