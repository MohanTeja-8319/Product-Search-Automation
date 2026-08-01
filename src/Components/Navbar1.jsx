
function Navbar() {
  return (
    <div className="bg-white border-b p-5 flex items-center justify-between">

      {/* Search */}
      <div className="flex items-center gap-3 w-2/3">

        <input
          type="text"
          placeholder="Search for products, brands and more..."
          className="flex-1 border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700">
          Search
        </button>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        <div className="text-3xl cursor-pointer">
          🔔
        </div>

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-xl">
            👤
          </div>

          <div>
            <p className="font-semibold">Hello, User</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Navbar;