import products from "../data/products";
import ProductCard from "./ProductCard";

function ProductsSection({
  selectedCategory,
  wishlist,
  setWishlist,
}) {

  const filteredProducts =
    selectedCategory === "All Categories"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">
  {selectedCategory === "All Categories"
    ? "Popular Products"
    : `${selectedCategory} Products`}
</h2>
{filteredProducts.length === 0 ? (
  <div className="bg-white rounded-xl p-10 text-center shadow">
    <h3 className="text-2xl font-bold text-gray-700">
      No products found
    </h3>

    <p className="text-gray-500 mt-2">
      Products will be added soon.
    </p>
  </div>
) : (
  <div className="grid grid-cols-3 gap-6">
    {filteredProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        wishlist={wishlist}
        setWishlist={setWishlist}
      />
    ))}
  </div>
)}
    </div>
  );
}

export default ProductsSection;