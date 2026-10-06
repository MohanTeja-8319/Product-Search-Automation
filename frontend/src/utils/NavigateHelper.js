/**
 * Returns the route for a product.
 * Always uses the /comparison/:name route which uses live API data.
 */
export const getProductRoute = (product) => {
  const name = product.name || product.title || "";
  return `/comparison/${encodeURIComponent(name)}`;
};