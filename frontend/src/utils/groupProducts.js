const groupProducts = (products) => {
  const grouped = {};

  products.forEach((product) => {
    const key = product.name;

    if (!grouped[key]) {
      grouped[key] = {
        ...product,
        lowestPrice: product.price,
        storeCount: 1,
        stores: [product.store],
      };
    } else {
      grouped[key].lowestPrice = Math.min(
        grouped[key].lowestPrice,
        product.price
      );

      grouped[key].storeCount += 1;

      grouped[key].stores.push(product.store);
    }
  });

  return Object.values(grouped);
};

export default groupProducts;