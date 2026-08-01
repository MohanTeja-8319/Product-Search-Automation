import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import comparisonProducts from "../data/comparisionProducts";

const RecentlyViewed = () => {

    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const recent =
            JSON.parse(localStorage.getItem("recentProducts")) || [];

        setProducts(recent);

    }, []);

    const openProduct = (product) => {

        const hasComparison =
            comparisonProducts[product.name] &&
            comparisonProducts[product.name].length > 0;

        if (hasComparison) {

            navigate(
                `/comparison/${encodeURIComponent(product.name)}`
            );

        } else {

            navigate(`/product/${product.id}`);

        }

    };

    if (products.length === 0) return null;

    return (

        <div className="bg-white rounded-xl border border-gray-200 mt-8 p-6">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                    Recently Viewed
                </h2>

                <button
                    onClick={() => {
                        localStorage.removeItem("recentProducts");
                        setProducts([]);
                    }}
                    className="text-sm text-red-500 hover:underline"
                >
                    Clear All
                </button>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">

                {products.map((product) => (

                    <div
                        key={product.id}
                        onClick={() => openProduct(product)}
                        className="cursor-pointer border rounded-xl p-4 hover:shadow-lg transition"
                    >

                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-36 w-full object-contain"
                        />

                        <h3 className="font-semibold mt-3 line-clamp-2">
                            {product.name}
                        </h3>

                        <p className="text-purple-700 font-bold mt-2">
                            ₹{product.price.toLocaleString()}
                        </p>

                        <div className="flex justify-between mt-2">

                            <span className="text-yellow-500">
                                ⭐ {product.rating}
                            </span>

                            <span className="text-green-600 text-sm">
                                {product.discount}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default RecentlyViewed;