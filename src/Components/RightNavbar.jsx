function Sidebar() {
  return (
    <div className="h-full flex flex-col bg-white">

      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-purple-600">
          PriceScout
        </h1>
        <p className="text-sm text-gray-500">
          Compare. Save. Get Notified.
        </p>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4 space-y-2">

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          🏠 Home
        </div>

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          🔍 Search Products
        </div>

        <div className="p-3 bg-purple-600 text-white rounded-lg">
          📂 Categories
        </div>

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          🔔 Price Alerts
        </div>

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          ❤️ Wishlist
        </div>

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          🔄 Comparison
        </div>

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          🕒 History
        </div>

      </div>

      {/* Bottom */}
      <div className="p-4 border-t">

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          ⚙ Settings
        </div>

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          ❓ Help & Support
        </div>

        <div className="p-3 rounded-lg hover:bg-purple-100 cursor-pointer">
          🚪 Logout
        </div>

        {/* Never Miss a Deal */}
        <div className="mt-6 bg-purple-50 rounded-xl p-5 text-center">

          <div className="text-5xl">
            🔔
          </div>

          <h3 className="font-bold text-lg mt-3">
            Never Miss a Deal!
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            Get notified instantly when prices drop.
          </p>

          <button className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
            Create Alert
          </button>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;