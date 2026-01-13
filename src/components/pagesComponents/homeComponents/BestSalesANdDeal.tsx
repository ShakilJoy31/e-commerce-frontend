import ProductCard from "@/components/common/card/ProductCard";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import Heading from "@/components/typography/Heading";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function BestSalesANdDeal({newArivalProducts, isLoading, companyData}) {



const smGrid = companyData?.data[0]?.smGrid;
const mdGrid = companyData?.data[0]?.mdGrid;
const lgGrid = companyData?.data[0]?.lgGrid;

  // Create refs for the next and previous buttons
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <SectionWrapper className="py-5">
     {
      newArivalProducts?.length ?  <div className="border-b-2 border-primary p-2 lg:p-4 flex items-center justify-between bg-gray-100 rounded-md shadow-md">
        {/* Left Section - Heading */}
        <Heading
          align="start"
          className="text-primary uppercase text-[14px] md:text-lg lg:text-xl font-semibold tracking-wide"
          variant={"primary"}
        >
           Deal Of The Day
        </Heading>

        {/* Right Section - See More Button */}
        <Link
          to={"/products"}
          className="text-blue-600 font-medium hover:underline flex items-center gap-1 transition-transform transform hover:scale-105"
        >
          <span>See More</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div> : null
     }

      <div className="relative mt-5">
        {isLoading ? (
          <div className="flex items-center gap-5 w-full h-full ">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : (
          <Swiper
            // autoplay={{
            //   delay: 5000,
            //   disableOnInteraction: false,
            // }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            loop={true}
            modules={[Navigation, Autoplay]}
            slidesPerView={2}
            spaceBetween={5}
            breakpoints={{
              // 200: { slidesPerView: 2, spaceBetween: 5 },
              375: { slidesPerView: smGrid, spaceBetween: 10 },
              640: { slidesPerView: smGrid, spaceBetween: 15 },
              768: { slidesPerView: mdGrid, spaceBetween: 20 },
              1024: { slidesPerView: lgGrid, spaceBetween: 25 },
              1280: { slidesPerView: lgGrid, spaceBetween: 30 },
            }}
            className="swiper-container pb-10"
            effect="fade"
            fadeEffect={{
              crossFade: true,
            }}
          >
            {newArivalProducts?.length > 0 ? (
              newArivalProducts?.map((items: any) => {
                const product = items.product
                const variation = product.VariationProduct?.[0];
                

                return (
                  <SwiperSlide
                    className=" swiper-slide border-[1px] rounded-md"
                    key={product.id}
                  >
                    <div className="relative flex flex-col justify-between h-auto swiper-slide-cover">
                      <ProductCard
                        id={product.productLink}
                        image={product?.ProductImage?.[0]?.imageUrl}
                        title={product.productName}
                        stock={product?.stock || 0}
                        description={
                          product.description || "No description available"
                        }
                        product={product}
                        reviews={product.reviews || 0}
                        reviewCount={product.reviews || 0}
                        discountPrice={variation?.discountPrice || 0}
                        originalPrice={variation?.price || 0} 
                        discountPercentage={product.discountPercentage || 0}
                        category={product.category}
                        subCategory={product.subCategory}
                        brand={product.brand || undefined}
                        highlightText={product.highlightText}
                      />
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              null
            )}
          </Swiper>
        )}
        <div className="flex gap-3 justify-center">
          <button
            ref={prevRef}
            className="z-30 p-2 text-black bg-gray-200 rounded-full hover:bg-gray-300"
            aria-label="Previous Slide"
          >
            <FaArrowLeftLong className="text-xl lg:text-2xl text-primary" />
          </button>
          <button
            ref={nextRef}
            className="p-2 text-black bg-gray-200 rounded-full hover:bg-gray-300"
            aria-label="Next Slide"
          >
            <FaArrowRightLong className="text-xl lg:text-2xl text-primary" />
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
