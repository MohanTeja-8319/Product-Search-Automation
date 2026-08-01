function RightSidebar() {
  return (
    <div className="w-80 bg-white border-l p-6">

      {/* Price Drop Alerts */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Price Drop Alerts</h2>
        <button className="text-purple-600 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">

        <div className="border rounded-xl p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">📱 iPhone 15 (128GB)</h3>
            <p className="text-red-500 font-bold">↓ ₹4,000 (5.41%)</p>
            <p className="font-semibold">Now ₹69,900</p>
            <p className="text-gray-500 text-sm">Amazon</p>
          </div>

          <div className="text-2xl">
            🔔
          </div>
        </div>

        <div className="border rounded-xl p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">💻 Dell Inspiron 15</h3>
            <p className="text-red-500 font-bold">↓ ₹1,500 (3.16%)</p>
            <p className="font-semibold">Now ₹45,990</p>
            <p className="text-gray-500 text-sm">Flipkart</p>
          </div>

          <div className="text-2xl">
            🔔
          </div>
        </div>

      </div>

      {/* Watchlist */}
      <div className="mt-10">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Your Watchlist</h2>

          <button className="text-purple-600 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">

          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">💻 MacBook Air M2</h3>
              <p className="font-bold">₹99,990</p>
              <p className="text-gray-500 text-sm">Target: ₹90,000</p>
            </div>
            <div className="text-2xl">🔔</div>
          </div>

          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">📱 Samsung Galaxy S24</h3>
              <p className="font-bold">₹74,999</p>
              <p className="text-gray-500 text-sm">Target: ₹70,000</p>
            </div>
            <div className="text-2xl">🔔</div>
          </div>

          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">🎧 Sony WH-1000XM5</h3>
              <p className="font-bold">₹29,990</p>
              <p className="text-gray-500 text-sm">Target: ₹28,000</p>
            </div>
            <div className="text-2xl">🔔</div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default RightSidebar;