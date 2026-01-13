import { useState, useEffect } from "react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/common/card/ProductCard";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import Heading from "@/components/typography/Heading";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const BrandProduct = ({BrandProducts, isLoading, companyData}) => {


  const smGrid = companyData?.data[0]?.smGrid;
  const mdGrid = companyData?.data[0]?.mdGrid;
  const lgGrid = companyData?.data[0]?.lgGrid;
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedBrandLink, setSelectedBrandLink] = useState<string | null>(
    null
  );
  const gridClass = `grid grid-cols-${smGrid} md:grid-cols-${mdGrid} lg:grid-cols-${lgGrid} gap-4`;

  // Set the first brand as the default selected brand
  useEffect(() => {
    if (BrandProducts?.length > 0) {
      setSelectedBrand(BrandProducts[0].brand);
      setSelectedBrandLink(BrandProducts[0].link);
    }
  }, [BrandProducts]);

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!BrandProducts || BrandProducts.length === 0) {
    return <></>;
  }

  return (
    <div className="mx-auto px-1">
      {/* Section Header */}
      <div className="border-b-2 border-primary p-2 lg:p-4 flex items-center justify-between bg-gray-100 rounded-md shadow-md">
        <Heading
          align="start"
          className="text-primary uppercase text-[14px] md:text-lg lg:text-xl font-semibold tracking-wide"
          variant="primary"
        >
          Shop By Brand
        </Heading>
        {/* Right Section - See More Button */}
        <Link
          to={`/brand/${selectedBrandLink}`}
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

      {/* Brand Name Slider */}
      <div className="relative mt-5 px-2 md:px-10">
        <Swiper
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".brand-prev-button",
            nextEl: ".brand-next-button",
          }}
          loop={true}
          modules={[Navigation]}
          slidesPerView={"auto"}
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 3, spaceBetween: 8 },
            480: { slidesPerView: 4, spaceBetween: 10 },
            640: { slidesPerView: 5, spaceBetween: 12 },
            768: { slidesPerView: 6, spaceBetween: 14 },
            1024: { slidesPerView: 8, spaceBetween: 16 },
            1280: { slidesPerView: 10, spaceBetween: 18 },
          }}
          className="swiper-container relative"
        >
          {BrandProducts.map((brandItem: any) => (
            <SwiperSlide key={brandItem.link} className="!w-auto">
              <button
                onClick={() => {
                  setSelectedBrand(brandItem.brand);
                  setSelectedBrandLink(brandItem.link);
                }}
                className={`
            h-8 w-20 md:h-16 md:w-28 m-2
            flex items-center justify-center
            bg-white border-2 rounded-lg shadow-md transition-all
            hover:shadow-lg hover:scale-[1.02]
            ${
              selectedBrand === brandItem.brand
                ? "border-primary shadow-lg scale-[1.03]"
                : "border-gray-200"
            }`}
              >
                <img
                  src={brandItem.image}
                  alt={brandItem.brand}
                  className="h-auto max-h-full w-auto max-w-full object-contain"
                  loading="lazy"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          className="brand-prev-button absolute left-0 lg:left-2 top-1/2 -translate-y-1/2 z-10 p-1 lg:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
          aria-label="Previous Slide"
        >
          <IoIosArrowBack className="h-5 w-5 lg:w-6 lg:h-6 text-gray-700 hover:text-primary" />
        </button>
        <button
          className="brand-next-button absolute right-0 lg:right-2 top-1/2 -translate-y-1/2 z-10 p-1 lg:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
          aria-label="Next Slide"
        >
          <IoIosArrowForward className="h-5 w-5 lg:w-6 lg:h-6 text-gray-700 hover:text-primary" />
        </button>
      </div>
      {/* Product Slider */}
      <div className="relative mt-5 border-t ">
        {BrandProducts.map(
          (brandItem: any) =>
            brandItem.brand === selectedBrand && (
              <motion.div
                key={brandItem.link}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Swiper
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  navigation={{
                    prevEl: ".prev-button",
                    nextEl: ".next-button",
                  }}
                  loop
                    watchOverflow={false} 
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
                  className="swiper-container py-5"
                >
                  {brandItem?.products?.length > 0 ? (
                    brandItem.products.map((product: any) => {
                      const variation = product.VariationProduct?.[0];
                      return (
                        <SwiperSlide
                          className="bg-[#EEEEEE] swiper-slide border-[1px] rounded-md"
                          key={product.id}
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                          >
                            <ProductCard
                              id={product.productLink}
                              image={product?.ProductImage?.[0]?.imageUrl}
                              title={product.productName}
                              stock={product?.stock || 0}
                              description={
                                product.description ||
                                "No description available"
                              }
                              product={product}
                              reviews={product.reviews || 0}
                              reviewCount={product.reviews || 0}
                              discountPrice={variation?.discountPrice || 0}
                              originalPrice={variation?.price || 0}
                              discountPercentage={
                                product.discountPercentage || 0
                              }
                              brand={product.brand || undefined}
                              highlightText={product.highlightText}
                              category={product.category}
                              subCategory={product.subCategory}
                            />
                          </motion.div>
                        </SwiperSlide>
                      );
                    })
                  ) : (
                    <SwiperSlide className="bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No products available</p>
                    </SwiperSlide>
                  )}
                </Swiper>
              </motion.div>
            )
        )}
        <button
          className="prev-button absolute left-14 top-[45%] z-30 -translate-x-full p-2 text-black bg-gray-200 rounded-full hover:bg-gray-300"
          aria-label="Previous Slide"
        >
          <IoIosArrowBack className="w-6 h-6" />
        </button>
        <button
          className="next-button absolute right-14 top-[45%] z-30 translate-x-full p-2 text-black bg-gray-200 rounded-full hover:bg-gray-300"
          aria-label="Next Slide"
        >
          <IoIosArrowForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default BrandProduct;
