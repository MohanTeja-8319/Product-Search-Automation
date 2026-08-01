function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-5 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-800">
        {product.name}
      </h3>

      <p className="text-gray-500 mt-2">
        {product.store}
      </p>

      <p className="text-purple-600 font-bold mt-3">
        {product.price}
      </p>

      <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
        Compare Price
      </button>
    </div>
  );
}

export default ProductCard;