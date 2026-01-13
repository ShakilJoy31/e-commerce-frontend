// import BannerRightSideCardSkeleton from "@/components/common/skeleton/BannerSideSkeleton";
// import { useGetProductsQuery } from "@/components/store/api/products/productApi";
// import { Product } from "@/types/product/product";

// export default function BannerRightCard() {
//   const { data: products, isLoading } = useGetProductsQuery({});
//   const filteredProducts =
//     products?.data?.filter(
//       (product: Product) => product?.isBannerSidebar === true
//     ) || [];

//   return (
//     <div className="flex lg:flex-col gap-4 h-[35vh] lg:h-[80vh]">
//       {/* Show skeletons if loading, otherwise show cards */}
//       {isLoading ? (
//         <>
//           <BannerRightSideCardSkeleton />
//           <BannerRightSideCardSkeleton />
//         </>
//       ) : (
//         <>
//           {/* First Card */}
//           <div className="relative bg-white w-full h-48 md:h-60 lg:h-80 rounded-lg overflow-hidden shadow-lg">
//             {filteredProducts[0]?.ProductImage[0]?.imageUrl && (
//               <img
//                 src={filteredProducts[0].ProductImage[0].imageUrl}
//                 alt="Product"
//                 className="w-full h-full object-contain"
//               />
//             )}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 p-4">
//               <div className="absolute bottom-3 left-3">
//                 <h3 className="text-lg lg:text-xl text-white font-bold">
//                   New Arrival
//                 </h3>
//                 <span className="text-sm lg:text-lg mt-1 block text-white font-bold">
//                   ৳{" "}
//                   {filteredProducts[0]?.price -
//                     filteredProducts[0]?.discountPrice}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Second Card */}
//           <div className="relative bg-white w-full h-48 md:h-60 lg:h-80 rounded-lg overflow-hidden shadow-lg">
//             {filteredProducts[1]?.ProductImage[0]?.imageUrl && (
//               <img
//                 src={filteredProducts[1].ProductImage[0].imageUrl}
//                 alt="Product"
//                 className="w-full h-full object-contain"
//               />
//             )}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 p-4">
//               <div className="absolute bottom-3 left-3">
//                 <h3 className="text-lg lg:text-xl text-white font-bold">
//                   New Arrival
//                 </h3>
//                 <span className="text-sm lg:text-lg mt-1 block text-white font-bold">
//                   ৳{" "}
//                   {filteredProducts[1]?.price -
//                     filteredProducts[1]?.discountPrice}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { Autoplay, Navigation } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import BannerRightSideCardSkeleton from "@/components/common/skeleton/BannerSideSkeleton";
import { Link } from "react-router-dom";

export default function BannerRightCard({smallbanners, isLoading}) {

  return (
    <div className="px-1 md:px-5 pt-3 bg-[#F7F0FF] relative ">
      {isLoading ? (
        <div className="flex items-center gap-5 w-full h-full">
          <BannerRightSideCardSkeleton />
          <BannerRightSideCardSkeleton />
          <BannerRightSideCardSkeleton />
        </div>
      ) : (
        <Swiper
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            375: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
          }}
          className="swiper-container"
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
        >
          {smallbanners?.length > 0 ? (
            smallbanners?.map((img: any) => (
              <SwiperSlide className="bg-[#EEEEEE] swiper-slide" key={img.id}>
                <div className="relative swiper-slide-cover">
                 <Link to={img?.link}>
                  <img
                    src={img.image}
                    alt="banner"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                 </Link>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No banner available</p>
            </SwiperSlide>
          )}
        </Swiper>
      )}
    </div>
  );
}
