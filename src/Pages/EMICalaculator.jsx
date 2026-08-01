import React, { useState, useMemo } from "react";

const EMICalculator = ({ price }) => {
  const [months, setMonths] = useState(12);
  const [interest, setInterest] = useState(12);

  const emi = useMemo(() => {
    const r = interest / 12 / 100;
    const n = months;

    if (r === 0) {
      return price / n;
    }

    return (
      (price * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1)
    );
  }, [price, months, interest]);

  const total = emi * months;
  const interestPaid = total - price;

  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">

      {/* Header */}

      <div className="px-6 py-5 border-b">

        <h2 className="text-2xl font-bold">

          EMI Calculator

        </h2>

        <p className="text-gray-500 mt-1">

          Estimate your monthly installment.

        </p>

      </div>

      <div className="p-6">

        {/* Amount */}

        <div className="mb-8">

          <p className="text-gray-500">

            Product Price

          </p>

          <h2 className="text-4xl font-bold text-purple-700 mt-2">

            ₹{price.toLocaleString()}

          </h2>

        </div>

        {/* Sliders */}

        <div className="space-y-8">

          <div>

            <div className="flex justify-between mb-2">

              <span>Loan Duration</span>

              <span>{months} Months</span>

            </div>

            <input
              type="range"
              min="3"
              max="36"
              value={months}
              onChange={(e) =>
                setMonths(Number(e.target.value))
              }
              className="w-full"
            />

          </div>

          <div>

            <div className="flex justify-between mb-2">

              <span>Interest Rate</span>

              <span>{interest}%</span>

            </div>

            <input
              type="range"
              min="5"
              max="20"
              value={interest}
              onChange={(e) =>
                setInterest(Number(e.target.value))
              }
              className="w-full"
            />

          </div>

        </div>

        {/* Result */}

        <div className="grid md:grid-cols-3 gap-5 mt-10">

          <div className="bg-purple-50 rounded-xl p-5">

            <p className="text-gray-500">

              Monthly EMI

            </p>

            <h2 className="text-3xl font-bold text-purple-700 mt-2">

              ₹{Math.round(emi).toLocaleString()}

            </h2>

          </div>

          <div className="bg-green-50 rounded-xl p-5">

            <p className="text-gray-500">

              Total Payment

            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-2">

              ₹{Math.round(total).toLocaleString()}

            </h2>

          </div>

          <div className="bg-red-50 rounded-xl p-5">

            <p className="text-gray-500">

              Interest Paid

            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">

              ₹{Math.round(interestPaid).toLocaleString()}

            </h2>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EMICalculator;