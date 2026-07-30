import { FaSearch, FaUserCircle, FaShoppingCart, FaHeart, FaSignOutAlt } from "react-icons/fa";

function Dashboard() {

  const products = [
    {
      id: 1,
      name: "Apple iPhone 15",
      price: "₹74,999",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      price: "₹69,999",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    },
    {
      id: 3,
      name: "OnePlus 12",
      price: "₹59,999",
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}

      <nav className="bg-indigo-700 text-white px-8 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Product Search Automation
        </h1>

        <div className="flex items-center gap-5">

          <FaHeart size={22} className="cursor-pointer" />

          <FaShoppingCart size={22} className="cursor-pointer" />

          <FaUserCircle size={34} className="cursor-pointer" />

          <button className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </nav>

      {/* Search */}

      <div className="flex justify-center mt-10">

        <div className="relative w-2/3">

          <FaSearch className="absolute left-5 top-4 text-gray-500" />

          <input
            type="text"
            placeholder="Search Products..."
            className="w-full p-4 pl-14 rounded-xl border shadow-md focus:ring-2 focus:ring-indigo-500 outline-none"
          />

        </div>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-3 gap-8 p-10">

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-gray-500">
            Total Searches
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            250
          </h1>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-gray-500">
            Wishlist
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            18
          </h1>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-gray-500">
            Compared Products
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            62
          </h1>

        </div>

      </div>

      {/* Products */}

      <div className="px-10">

        <h2 className="text-3xl font-bold mb-6">
          Popular Products
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {products.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 duration-300"
            >

              <img
                src={item.image}
                className="h-60 w-full object-cover"
                alt={item.name}
              />

              <div className="p-5">

                <h3 className="text-xl font-bold">
                  {item.name}
                </h3>

                <p className="text-indigo-600 text-lg mt-2">
                  {item.price}
                </p>

                <button className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">

                  Compare Price

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;