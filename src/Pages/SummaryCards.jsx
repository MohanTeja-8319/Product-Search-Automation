import React from "react";

const SummaryCards = ({
comparison,
lowestPrice,
highestPrice,
averagePrice,
savings,
bestDeal,
}) => {
return (
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">

{/* Lowest Price */}
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-green-500 transition">
<p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">Lowest Price</p>
<h2 className="text-xl sm:text-3xl font-bold text-green-600 mt-2">
          ₹{lowestPrice.toLocaleString()}
</h2>
</div>

{/* Highest Price */}
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-red-500 transition">
<p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">Highest Price</p>
<h2 className="text-xl sm:text-3xl font-bold text-red-500 mt-2">
          ₹{highestPrice.toLocaleString()}
</h2>
</div>

{/* Average Price */}
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-purple-500 transition">
<p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">Average Price</p>
<h2 className="text-xl sm:text-3xl font-bold text-purple-600 mt-2">
          ₹{averagePrice.toLocaleString()}
</h2>
</div>

{/* Savings */}
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-indigo-500 transition">
<p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">Maximum Savings</p>
<h2 className="text-xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
          ₹{savings.toLocaleString()}
</h2>
</div>

{/* Total Stores */}
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-blue-500 transition">
<p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">Stores Compared</p>
<h2 className="text-xl sm:text-3xl font-bold text-blue-600 mt-2">
{comparison.length}
</h2>
</div>

{/* Average Rating */}
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-yellow-500 transition">
<p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">Average Rating</p>
<h2 className="text-xl sm:text-3xl font-bold text-yellow-500 mt-2">
{(
comparison.reduce((sum, item) => sum + item.rating, 0) /
comparison.length
          ).toFixed(1)}
</h2>
</div>

{/* Recommended */}
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-green-500 transition">
<p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">Recommended Store</p>
<h2 className="text-lg sm:text-2xl font-bold text-green-600 mt-3">
{bestDeal.store}
</h2>
</div>

{/* Best Discount */}
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-pink-500 transition">
<p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">Best Discount</p>
<h2 className="text-lg sm:text-2xl font-bold text-pink-600 mt-3">
{bestDeal.discount}
</h2>
</div>

</div>
  );
};

export default SummaryCards;