import React, { useState } from "react";

const Wishlist = ({ productName }) => {

  const [saved, setSaved] = useState(false);

  return (

    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      <div className="flex items-center justify-between p-6">

        <div>

          <h2 className="text-2xl font-bold">

            Wishlist

          </h2>

          <p className="text-gray-500 mt-1">

            Save this product for later.

          </p>

        </div>

        <button
          onClick={() => setSaved(!saved)}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            saved
              ? "bg-red-500 text-white"
              : "border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
          }`}
        >
          {saved ? "❤️ Saved" : "♡ Add to Wishlist"}
        </button>

      </div>

    </div>

  );

};

export default Wishlist;