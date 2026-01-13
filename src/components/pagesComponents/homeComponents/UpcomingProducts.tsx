import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import Heading from "@/components/typography/Heading";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import { Link } from "react-router-dom";

const UpcomingProducts = ({productsData, productLoading}) => {
 
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <>
      {productsData?.length > 0 && (
        <SectionWrapper className="mb-10">
          {productsData?.length ? (
            <div className="border-b-2 border-primary p-2 lg:p-4 flex items-center justify-between bg-gray-100 rounded-md shadow-md">
              <Heading
                align="start"
                className="text-primary uppercase text-[14px] md:text-lg lg:text-xl font-semibold tracking-wide"
                variant="primary"
              >
                🚀 Upcoming Products
              </Heading>
            </div>
          ) : null}

          <div className="relative mt-8">
            {productLoading ? (
              <div className="flex items-center gap-5 w-full h-full">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            ) : (
              <Swiper
                onBeforeInit={(swiper) => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = prevRef.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                loop={true}
                modules={[Navigation, Autoplay]}
                slidesPerView={2}
                spaceBetween={10}
                breakpoints={{
                  375: { slidesPerView: 2, spaceBetween: 10 },
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 25 },
                  1280: { slidesPerView: 5, spaceBetween: 30 },
                }}
                className="swiper-container pb-10"
                effect="fade"
                fadeEffect={{
                  crossFade: true,
                }}
              >
                {productsData?.length > 0
                  ? productsData?.map((product: any) => {
                      return (
                        <SwiperSlide
                          className="bg-white border rounded-lg shadow-md p-4 flex flex-col h-full"
                          key={product.id}
                        >
                          <Link to={`/products/${product?.productLink}`}>
                            <div className="flex flex-col items-center">
                              {/* Product Image */}
                              <img
                                src={
                                  product.ProductImage?.[0]?.imageUrl ||
                                  "fallback_image_url"
                                }
                                alt={product.productName}
                                className="w-[145px] h-[145px] object-contain rounded-md"
                              />

                              <img
                                src={product?.brand.image}
                                alt={product?.brand?.brand}
                                className="w-14 h-10 object-contain mx-auto hover:scale-105 mt-5 duration-500 transform transition-all"
                              />
                              {/* Product Details */}
                              <div className="mt-4 text-center">
                                <h3 className="text-base font-semibold text-gray-800">
                                  {product.productName}
                                </h3>
                                {/* <div className="mt-2 flex justify-center gap-4 items-center">
                                  <span className="text-sm text-gray-600">
                                    {product.category.name}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {product.subCategory[0]?.subCategory.name}
                                  </span>
                                </div> */}
                                {/* Price */}
                                {/* <div className="mt-3">
                            <span className="text-lg font-bold text-blue-600">
                              Price Coming Soon
                            </span>
                          </div> */}
                                {/* Status */}
                                <div className="mt-5 mb-2">
                                  <span className="text-sm text-orange-500 bg-orange-100 px-3 py-1 rounded-full">
                                    Coming soon...
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })
                  : null}
              </Swiper>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-center mt-">
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
      )}
    </>
  );
};

export default UpcomingProducts;
