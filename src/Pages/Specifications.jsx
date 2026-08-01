import React from "react";

const Specifications = ({ product }) => {
  if (!product) return null;

  const specs = [
    {
      label: "Brand",
      value: product.brand || "Not Available",
    },
    {
      label: "Category",
      value: product.category || "Not Available",
    },
    {
      label: "Model",
      value: product.name || "Not Available",
    },
    {
      label: "Rating",
      value: `⭐ ${product.rating}`,
    },
    {
      label: "Availability",
      value: product.availability || "In Stock",
    },
    {
      label: "Store",
      value: product.store || "-",
    },
    {
      label: "Original Price",
      value: product.originalPrice
        ? `₹${product.originalPrice.toLocaleString()}`
        : "-",
    },
    {
      label: "Current Price",
      value: `₹${product.price.toLocaleString()}`,
    },
    {
      label: "Discount",
      value: product.discount,
    },
    {
      label: "Reviews",
      value: product.reviews
        ? product.reviews.toLocaleString()
        : "-",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      <div className="px-6 py-5 border-b border-gray-200">

        <h2 className="text-2xl font-bold">

          Product Specifications

        </h2>

        <p className="text-gray-500 text-sm mt-1">

          Technical details of this product.

        </p>

      </div>

      <table className="w-full">

        <tbody>

          {specs.map((item, index) => (

            <tr
              key={index}
              className={`${
                index % 2 === 0
                  ? "bg-gray-50"
                  : "bg-white"
              } border-b border-gray-100`}
            >

              <td className="w-1/3 px-6 py-4 font-semibold text-gray-700">

                {item.label}

              </td>

              <td className="px-6 py-4 text-gray-900">

                {item.value}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Specifications;