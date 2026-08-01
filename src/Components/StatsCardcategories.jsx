function StatsCard({ icon, number, text }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 hover:shadow-xl transition-all duration-300">

      <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>

      <h2 className="text-3xl font-bold text-gray-800">
        {number}
      </h2>

      <p className="text-gray-500 mt-2">
        {text}
      </p>

    </div>
  );
}

export default StatsCard;