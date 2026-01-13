import ProductCard from "@/components/common/card/ProductCard";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Heading from "@/components/typography/Heading";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import { Link } from "react-router-dom";

export default function NewArrivalAddProducts({newArivalProducts, isLoading, companyData}) {


  const smGrid = companyData?.data[0]?.smGrid;
  const mdGrid = companyData?.data[0]?.mdGrid;
  const lgGrid = companyData?.data[0]?.lgGrid;

  

  return (
    <SectionWrapper className="pt-5">
      {newArivalProducts?.length ? (
        <div className="border-b-2 border-primary p-2 lg:p-4 flex items-center justify-between bg-gray-100 rounded-md shadow-md">
          {/* Left Section - Heading */}
          <Heading
            align="start"
            className="text-primary uppercase text-[14px] md:text-lg lg:text-xl font-semibold tracking-wide"
            variant={"primary"}
          >
            New Arrival
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
        </div>
      ) : null}

      <div className="relative mt-5">
        {isLoading ? (
          <div className="flex items-center gap-5 w-full h-full">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : (
          <Swiper
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: ".new-arrival-prev",
              nextEl: ".new-arrival-next",
            }}
            loop={true}
            modules={[Navigation, Autoplay]}
            slidesPerView={2}
            spaceBetween={5}
            breakpoints={{
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
            {newArivalProducts?.length > 0
              ? newArivalProducts?.map((items: any) => {
                  const product = items.product;
                  const variation = product.VariationProduct?.[0];
                  return (
                    <SwiperSlide
                      className="swiper-slide border-[1px] rounded-md"
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
                          originalPrice={variation?.price || 0} // Showing original price as line-through
                          discountPercentage={product.discountPercentage || 0}
                          category={product.category}
                          brand={product.brand || undefined}
                          highlightText={product.highlightText}
                          subCategory={product.subCategory}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })
              : null}
          </Swiper>
        )}
        <button
          className="new-arrival-prev absolute left-14 top-[45%] z-30 -translate-x-full p-2 text-black bg-gray-200 rounded-full hover:bg-gray-300"
          aria-label="Previous Slide"
        >
          <IoIosArrowBack className="w-6 h-6" />
        </button>
        <button
          className="new-arrival-next absolute right-14 top-[45%] z-30 translate-x-full p-2 text-black bg-gray-200 rounded-full hover:bg-gray-300"
          aria-label="Next Slide"
        >
          <IoIosArrowForward className="w-6 h-6" />
        </button>
      </div>
    </SectionWrapper>
  );
}
