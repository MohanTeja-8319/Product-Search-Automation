import React from "react";
import storeLogos from "../data/logos";

const ComparisonTable = ({ comparison, lowestPrice }) => {

    return (

        <div className="bg-white rounded-xl border border-gray-200 mt-6 overflow-hidden">

            <div className="px-6 py-5 border-b">

                <h2 className="text-2xl font-bold">

                    Compare Stores

                </h2>

                <p className="text-gray-500 mt-1">

                    Compare prices from all available stores

                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left px-6 py-4">

                                Store

                            </th>

                            <th className="text-center">

                                Price

                            </th>

                            <th className="text-center">

                                Rating

                            </th>

                            <th className="text-center">

                                Discount

                            </th>

                            <th className="text-center">

                                Availability

                            </th>

                            <th className="text-center">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {comparison.map((store) => (

                            <tr
                                key={store.id}
                                className={`border-t hover:bg-gray-50 ${
                                    store.price === lowestPrice
                                        ? "bg-green-50"
                                        : ""
                                }`}
                            >

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <img
                                            src={storeLogos[store.store]}
                                            alt={store.store}
                                            className="w-10 h-10 object-contain"
                                        />

                                        <div>

                                            <h3 className="font-semibold">

                                                {store.store}

                                            </h3>

                                            {store.price === lowestPrice && (

                                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">

                                                    Best Deal

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </td>

                                <td className="text-center font-bold text-purple-700">

                                    ₹{store.price.toLocaleString()}

                                </td>

                                <td className="text-center">

                                    ⭐ {store.rating}

                                </td>

                                <td className="text-center text-green-600 font-semibold">

                                    {store.discount}

                                </td>

                                <td className="text-center">

                                    In Stock

                                </td>

                                <td className="text-center">

                                    <a
                                        href={store.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
                                    >

                                        Visit

                                    </a>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default ComparisonTable;