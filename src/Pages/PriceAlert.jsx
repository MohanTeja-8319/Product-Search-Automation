import React, { useState } from "react";

const PriceAlert = ({ currentPrice }) => {
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState(currentPrice);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) return;

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setTargetPrice(currentPrice);
    }, 3000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      <div className="px-6 py-5 border-b border-gray-200">

        <h2 className="text-2xl font-bold">
          🔔 Price Alert
        </h2>

        <p className="text-gray-500 mt-1">
          Get notified when this product becomes cheaper.
        </p>

      </div>

      <div className="p-6">

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left */}

          <div>

            <p className="text-gray-600 mb-5">

              Current Lowest Price

            </p>

            <h2 className="text-5xl font-bold text-purple-600">

              ₹{currentPrice.toLocaleString()}

            </h2>

            <p className="text-gray-500 mt-4">

              We'll notify you whenever the price reaches your target.

            </p>

          </div>

          {/* Right */}

          <div className="space-y-5">

            <div>

              <label className="block mb-2 font-medium">

                Email Address

              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">

                Notify Me At Price

              </label>

              <input
                type="number"
                value={targetPrice}
                onChange={(e) =>
                  setTargetPrice(Number(e.target.value))
                }
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition"
            >
              Set Price Alert
            </button>

            {submitted && (
              <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-4">

                ✅ Price alert created successfully!

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default PriceAlert;