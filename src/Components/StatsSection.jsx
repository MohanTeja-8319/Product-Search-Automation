function StatsSection() {
  return (
    <div className="grid grid-cols-4 gap-4 mt-8">

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500">Products</h3>
        <p className="text-3xl font-bold text-purple-600">120</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500">Active Alerts</h3>
        <p className="text-3xl font-bold text-green-600">24</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500">Wishlist</h3>
        <p className="text-3xl font-bold text-pink-600">15</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500">Saved ₹</h3>
        <p className="text-3xl font-bold text-blue-600">₹8,500</p>
      </div>

    </div>
  );
}

export default StatsSection;