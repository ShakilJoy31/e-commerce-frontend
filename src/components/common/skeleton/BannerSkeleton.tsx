
import { FaImage } from "react-icons/fa";

export default function BannerSkeleton() {
  return (
    <div className="relative text-white swiper-slide-cover">
      {/* Skeleton for the banner image */}
      <div className="w-full h-[80vh] bg-gray-200 animate-pulse flex items-center justify-center">
        {/* Centered image icon */}
        <FaImage className="text-gray-400 text-6xl" />
      </div>

      {/* Skeleton for the "Shop Now" button */}
      <div className="absolute bottom-5 right-5">
        <div className="w-32 h-10 bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}
