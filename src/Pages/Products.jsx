function Products() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-purple-600 mb-8">
        Products
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold">iPhone 16</h2>
          <p className="text-gray-500 mt-2">Amazon</p>
          <p className="text-purple-600 font-bold mt-3">₹79,999</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold">Samsung Galaxy S24</h2>
          <p className="text-gray-500 mt-2">Flipkart</p>
          <p className="text-purple-600 font-bold mt-3">₹69,999</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold">OnePlus 13</h2>
          <p className="text-gray-500 mt-2">Croma</p>
          <p className="text-purple-600 font-bold mt-3">₹54,999</p>
        </div>

      </div>

    </div>
  );
}

export default Products;