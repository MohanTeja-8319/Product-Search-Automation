const SearchProducts=()=>{
    return(
        <>
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

  {/* Table Header */}
  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] bg-gray-50 border-b border-gray-200 px-6 py-4 text-xs font-semibold uppercase text-gray-500">

    <div>Product</div>
    <div>Price</div>
    <div>Store</div>
    <div>Price Change</div>
    <div className="text-center">Action</div>

  </div>

  {/* Row 1 */}

  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50">

    <div className="flex items-center gap-4">

      <img
        src="https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg"
        className="w-14 h-14 object-contain rounded-lg border"
        alt=""
      />

      <div>

        <h3 className="font-semibold text-sm">
          Apple iPhone 15 (128GB)
        </h3>

        <p className="text-xs text-gray-500">
          Black
        </p>

      </div>

    </div>

    <div className="font-semibold text-sm">
      ₹69,900
    </div>

    <div className="text-sm">
      Amazon
    </div>

    <div>
      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
        ↓ 5.4%
      </span>
    </div>

    <div className="flex justify-center">
      <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-600 hover:text-white">
        View Deal
      </button>
    </div>

  </div>

  {/* Row 2 */}

  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50">

    <div className="flex items-center gap-4">

      <img
        src="https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24.jpg"
        className="w-14 h-14 object-contain rounded-lg border"
        alt=""
      />

      <div>

        <h3 className="font-semibold text-sm">
          Samsung Galaxy S24
        </h3>

        <p className="text-xs text-gray-500">
          256GB
        </p>

      </div>

    </div>

    <div className="font-semibold text-sm">
      ₹74,999
    </div>

    <div className="text-sm">
      Flipkart
    </div>

    <div>
      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
        ↑ 2.1%
      </span>
    </div>

    <div className="flex justify-center">
      <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-600 hover:text-white">
        View Deal
      </button>
    </div>

  </div>

  {/* Row 3 */}

  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50">

    <div className="flex items-center gap-4">

      <img
        src="https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg"
        className="w-14 h-14 object-contain rounded-lg border"
        alt=""
      />

      <div>

        <h3 className="font-semibold text-sm">
          OnePlus 12
        </h3>

        <p className="text-xs text-gray-500">
          256GB
        </p>

      </div>

    </div>

    <div className="font-semibold text-sm">
      ₹64,999
    </div>

    <div className="text-sm">
      Croma
    </div>

    <div>
      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
        ↓ 3.8%
      </span>
    </div>

    <div className="flex justify-center">
      <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-600 hover:text-white">
        View Deal
      </button>
    </div>

  </div>

  {/* Row 4 */}

  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50">

    <div className="flex items-center gap-4">

      <img
        src="https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg"
        className="w-14 h-14 object-contain rounded-lg border"
        alt=""
      />

      <div>

        <h3 className="font-semibold text-sm">
          Google Pixel 8
        </h3>

        <p className="text-xs text-gray-500">
          128GB
        </p>

      </div>

    </div>

    <div className="font-semibold text-sm">
      ₹59,999
    </div>

    <div className="text-sm">
      Reliance Digital
    </div>

    <div>
      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
        ↓ 6.2%
      </span>
    </div>

    <div className="flex justify-center">
      <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-600 hover:text-white">
        View Deal
      </button>
    </div>

  </div>

  {/* Row 5 */}

  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 hover:bg-gray-50">

    <div className="flex items-center gap-4">

      <img
        src="https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg"
        className="w-14 h-14 object-contain rounded-lg border"
        alt=""
      />

      <div>

        <h3 className="font-semibold text-sm">
          Xiaomi 14
        </h3>

        <p className="text-xs text-gray-500">
          256GB
        </p>

      </div>

    </div>

    <div className="font-semibold text-sm">
      ₹54,999
    </div>

    <div className="text-sm">
      Vijay Sales
    </div>

    <div>
      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
        ↑ 1.3%
      </span>
    </div>

    <div className="flex justify-center">
      <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-600 hover:text-white">
        View Deal
      </button>
    </div>

  </div>
  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50">

    <div className="flex items-center gap-4">

      <img
        src="https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg"
        className="w-14 h-14 object-contain rounded-lg border"
        alt=""
      />

      <div>

        <h3 className="font-semibold text-sm">
          Apple iPhone 15 (128GB)
        </h3>

        <p className="text-xs text-gray-500">
          Black
        </p>

      </div>

    </div>

    <div className="font-semibold text-sm">
      ₹69,900
    </div>

    <div className="text-sm">
      Amazon
    </div>

    <div>
      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
        ↓ 5.4%
      </span>
    </div>

    <div className="flex justify-center">
      <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-600 hover:text-white">
        View Deal
      </button>
    </div>

  </div>

  {/* Row 2 */}

  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50">

    <div className="flex items-center gap-4">

      <img
        src="https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24.jpg"
        className="w-14 h-14 object-contain rounded-lg border"
        alt=""
      />

      <div>

        <h3 className="font-semibold text-sm">
          Samsung Galaxy S24
        </h3>

        <p className="text-xs text-gray-500">
          256GB
        </p>

      </div>

    </div>

    <div className="font-semibold text-sm">
      ₹74,999
    </div>

    <div className="text-sm">
      Flipkart
    </div>

    <div>
      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
        ↑ 2.1%
      </span>
    </div>

    <div className="flex justify-center">
      <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-600 hover:text-white">
        View Deal
      </button>
    </div>

  </div>

  {/* Row 3 */}

  <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50">

    <div className="flex items-center gap-4">

      <img
        src="https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg"
        className="w-14 h-14 object-contain rounded-lg border"
        alt=""
      />

      <div>

        <h3 className="font-semibold text-sm">
          OnePlus 12
        </h3>

        <p className="text-xs text-gray-500">
          256GB
        </p>

      </div>

    </div>

    <div className="font-semibold text-sm">
      ₹64,999
    </div>

    <div className="text-sm">
      Croma
    </div>

    <div>
      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
        ↓ 3.8%
      </span>
    </div>

    <div className="flex justify-center">
      <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-600 hover:text-white">
        View Deal
      </button>
    </div>

  </div>

</div>

{/* Pagination */}

<div className="flex items-center justify-between mt-6">

  <p className="text-sm text-gray-500">
    Showing 1–5 of 120 results
  </p>

  <div className="flex items-center gap-2">

    <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">
      Previous
    </button>

    <button className="w-10 h-10 rounded-lg bg-purple-600 text-white">
      1
    </button>

    <button className="w-10 h-10 rounded-lg border hover:bg-gray-100">
      2
    </button>

    <button className="w-10 h-10 rounded-lg border hover:bg-gray-100">
      3
    </button>

    <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">
      Next
    </button>

  </div>

</div>
        </>
    )
}

export default SearchProducts;