import React, { useState } from "react";

const faqData = [
  {
    question: "Which store currently offers the lowest price?",
    answer:
      "The store highlighted as 'Best Deal' provides the lowest available price at this moment.",
  },
  {
    question: "How often are prices updated?",
    answer:
      "Prices are updated periodically whenever fresh product data is available.",
  },
  {
    question: "Are the prices inclusive of all taxes?",
    answer:
      "Yes. The displayed prices include applicable taxes unless stated otherwise by the seller.",
  },
  {
    question: "Can prices change after I visit the store?",
    answer:
      "Yes. Prices may change depending on stock availability, seller offers and ongoing sales.",
  },
  {
    question: "How is the Best Deal selected?",
    answer:
      "The lowest available price along with seller rating and availability is considered.",
  },
  {
    question: "Does this website sell products directly?",
    answer:
      "No. This platform compares prices and redirects users to the respective online store.",
  },
];

const FAQ = () => {

  const [active,setActive]=useState(null);

  const toggle=(index)=>{
    setActive(active===index ? null:index);
  }

  return (

    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      <div className="px-6 py-5 border-b">

        <h2 className="text-2xl font-bold">

          Frequently Asked Questions

        </h2>

        <p className="text-gray-500 mt-1">

          Common questions about this product comparison.

        </p>

      </div>

      <div className="divide-y">

        {faqData.map((item,index)=>(

          <div
            key={index}
            className="p-5 cursor-pointer"
            onClick={()=>toggle(index)}
          >

            <div className="flex justify-between items-center">

              <h3 className="font-semibold text-lg">

                {item.question}

              </h3>

              <span className="text-2xl">

                {active===index ? "−" : "+"}

              </span>

            </div>

            {active===index && (

              <p className="text-gray-600 mt-4 leading-7">

                {item.answer}

              </p>

            )}

          </div>

        ))}

      </div>

    </div>

  );

};

export default FAQ;