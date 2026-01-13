import { FaImage } from "react-icons/fa";

export default function BannerRightSideCardSkeleton() {
  return (
    <div className="relative bg-gray-200 w-full h-48 md:h-60 lg:h-80 rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="flex items-center justify-center w-full h-full">
        <FaImage className="text-gray-400 text-5xl" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 p-4">
        <div className="absolute bottom-3 left-3">
          <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse mb-2"></div>
          <div className="w-16 h-5 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
