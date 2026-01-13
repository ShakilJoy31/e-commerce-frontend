const ProductCardSkeleton = () => {
  return (
    <div className="relative bg-gray-200 rounded-lg shadow-md overflow-hidden w-full animate-pulse">
      {/* Image Placeholder */}
      <div className="relative bg-gray-300 w-full h-48">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16l5.5-6 4 4 4.5-6 5 6M5 20h14"
            />
          </svg>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="p-4 space-y-3">
        {/* Title Placeholder */}
        <div className="bg-gray-300 h-6 w-3/4 rounded-md"></div>

        {/* Description Placeholder */}
        <div className="bg-gray-300 h-4 w-5/6 rounded-md"></div>

        {/* Reviews Placeholder */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-300 h-5 w-20 rounded-md"></div>
          <div className="bg-gray-300 h-5 w-10 rounded-md"></div>
        </div>

        {/* Price Placeholder */}
        <div className="flex space-x-3 items-center mt-2">
          <div className="bg-gray-300 h-6 w-20 rounded-md"></div>
          <div className="bg-gray-300 h-6 w-14 rounded-md"></div>
        </div>
      </div>

      {/* Button Placeholder */}
      <div className="flex justify-center items-center gap-3 py-3">
        <div className="bg-gray-300 h-10 w-28 rounded-md"></div>
        <div className="bg-gray-300 h-10 w-28 rounded-md"></div>
      </div>
    </div>
  );
};
export default ProductCardSkeleton;
