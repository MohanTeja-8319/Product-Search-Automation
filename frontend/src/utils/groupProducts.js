const groupProducts = (products) => {
  const grouped = {};

  products.forEach((product) => {
    const key = product.name;

    const parsePrice = (p) => typeof p === 'string' ? (Number(p.replace(/[^\d.]/g, '')) || 0) : (p || 0);
    const numericPrice = parsePrice(product.price);
    
    if (!grouped[key]) {
      grouped[key] = {
        ...product,
        lowestPrice: numericPrice,
        storeCount: 1,
        stores: [product.store],
      };
    } else {
      grouped[key].lowestPrice = Math.min(
        grouped[key].lowestPrice,
        numericPrice
      );

      grouped[key].storeCount += 1;

      grouped[key].stores.push(product.store);
    }
  });

  return Object.values(grouped);
};

export default groupProducts;