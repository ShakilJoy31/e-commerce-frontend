const TopBrandsSkeleton = () => {
  return (
    <>
      <div className="relative bg-gray-300 w-full h-36">
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
        <div className="px-10 py-5 animate-pulse"></div>
      </div>
    </>
  );
};

export default TopBrandsSkeleton;
