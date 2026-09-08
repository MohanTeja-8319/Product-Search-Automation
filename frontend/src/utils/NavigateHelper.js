import comparisonProducts from "../data/comparisionProducts";

export const getProductRoute = (product) => {

    const hasComparison =
        comparisonProducts[product.name] &&
        comparisonProducts[product.name].length > 0;

    if (hasComparison) {

        return `/comparison/${encodeURIComponent(product.name)}`;

    }

    return `/product/${product.id}`;

};