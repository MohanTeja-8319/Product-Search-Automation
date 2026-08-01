function CategoryCard({
  icon,
  title,
  description,
  onClick,
  isSelected,
}) {
  return (
    <div
  onClick={onClick}
  className={`
    rounded-2xl shadow-md border border-gray-200 p-5 cursor-pointer
    transition-all duration-300 ease-in-out
    ${
      isSelected
        ? "bg-purple-600 text-white border-purple-600"
        : "bg-white hover:shadow-xl hover:-translate-y-1"
    }
  `}
>
      <div
  className={`flex justify-center text-5xl mb-4 ${
    isSelected ? "text-white" : "text-purple-600"
  }`}
>
        {icon}
      </div>

<h3
  className={`text-lg font-bold text-center ${
    isSelected ? "text-white" : "text-gray-800"
  }`}
>
  {title}
</h3>

      <p
  className={`text-center text-sm mt-2 ${
    isSelected ? "text-purple-100" : "text-gray-500"
  }`}
>
  {description}
</p>
    </div>
  );
}

export default CategoryCard;