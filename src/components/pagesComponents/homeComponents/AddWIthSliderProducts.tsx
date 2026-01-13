import ProductCard from "@/components/common/card/ProductCard";
import { Autoplay, Navigation } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { useGetProductsNewArivalQuery } from "@/components/store/api/products/productApi";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import { Link } from "react-router-dom";

export default function AddWIthSliderProducts({newArivalProducts, banner, isLoading}) {

  return (
    <div className="px-1">
      {newArivalProducts?.data?.length > 0 && (
        <div className="grid grid-cols-12 gap-5 py-5">
          {/* Left Advertisement Section */}
          <div className="col-span-12 md:col-span-3">
            <Link to={banner?.data[0]?.bannerTwoLink}>
              <img
                src={banner?.data[0]?.bannerTwo}
                alt="Advertisement"
                className="w-full h-full object-contain rounded-lg shadow"
              />
            </Link>
          </div>

          {/* Right Products Slider Section */}
          <div className="col-span-12 md:col-span-9  relative">
            {isLoading ? (
              <div className="flex items-center gap-5 w-full h-full">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            ) : (
              <Swiper
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  prevEl: ".add-products-prev",
                  nextEl: ".add-products-next",
                }}
                loop={true}
                modules={[Navigation, Autoplay]}
                slidesPerView={2}
                spaceBetween={5}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 4 },
                }}
                className="swiper-container"
                effect="fade"
                fadeEffect={{
                  crossFade: true,
                }}
              >
                {newArivalProducts?.length > 0 ? (
                  newArivalProducts?.map((product: any) => {
                    const variation = product.product.VariationProduct?.[0];
                    return (
                      <SwiperSlide
                        className="swiper-slid border-[1px] rounded-md"
                        key={product.product.id}
                      >
                        <div className="relative flex flex-col justify-between  swiper-slide-cover">
                          <ProductCard
                            id={product.product.productLink}
                            image={product?.product.ProductImage?.[0]?.imageUrl}
                            title={product.product.productName}
                            stock={product?.product.stock || 0}
                            description={
                              product?.product.description ||
                              "No description available"
                            }
                            product={product.product}
                            reviews={product.product.reviews || 0}
                            reviewCount={product.product.reviews || 0}
                            discountPrice={variation?.discountPrice || 0}
                            originalPrice={variation?.price || 0} // Showing original price as line-through
                            discountPercentage={
                              product.product.discountPercentage || 0
                            }
                            brand={product.product.brand || undefined}
                            highlightText={product.product.highlightText}
                            category={product.product.category}
                            subCategory={product.product.subCategory}
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })
                ) : (
                  <SwiperSlide className="bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No products available</p>
                  </SwiperSlide>
                )}
              </Swiper>
            )}
            <button
              className="add-products-prev absolute left-14 top-[45%] z-30 -translate-x-full p-2 text-black bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="Previous Slide"
            >
              <IoIosArrowBack className="w-6 h-6" />
            </button>
            <button
              className="add-products-next absolute right-14 top-[45%] z-30 translate-x-full p-2 text-black bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="Next Slide"
            >
              <IoIosArrowForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
