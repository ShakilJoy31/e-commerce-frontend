import { motion } from "framer-motion";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SliderSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(5);

  const {
    data: productCategories,
    isLoading,
    isError,
  } = useGetAllCategoryQuery({});

  // Dynamically set the number of visible products based on screen size
  useEffect(() => {
    const updateVisibleProducts = () => {
      if (window.innerWidth >= 1024) {
        setVisibleProducts(5);
      } else if (window.innerWidth >= 768) {
        setVisibleProducts(3);
      } else {
        setVisibleProducts(1);
      }
    };

    updateVisibleProducts();
    window.addEventListener("resize", updateVisibleProducts);

    return () => window.removeEventListener("resize", updateVisibleProducts);
  }, []);

  // Calculate the visible products
  const getVisibleProducts = () => {
    if (!productCategories?.data || productCategories.data.length === 0) {
      return [];
    }

    const totalProducts = productCategories.data.length;

    if (startIndex + visibleProducts <= totalProducts) {
      // Simple case: No wrapping needed
      return productCategories.data.slice(
        startIndex,
        startIndex + visibleProducts
      );
    } else {
      // Wrapping case: Concatenate end and beginning slices
      const endSlice = productCategories.data.slice(startIndex);
      const startSlice = productCategories.data.slice(
        0,
        (startIndex + visibleProducts) % totalProducts
      );
      return [...endSlice, ...startSlice];
    }
  };

  const handlePrev = () => {
    if (!productCategories?.data) return;
    setStartIndex(
      (prevIndex) =>
        (prevIndex - 1 + productCategories.data.length) %
        productCategories.data.length
    );
  };

  const handleNext = () => {
    if (!productCategories?.data) return;
    setStartIndex(
      (prevIndex) => (prevIndex + 1) % productCategories.data.length
    );
  };

  const visibleProductItems = getVisibleProducts();

  return (
    <div className="w-full lg:mx-10 flex justify-center items-center">
      {/* Slider Section */}
      <div className="relative overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md z-10"
        >
          <ArrowLeft className="w-[24px] h-[24px] text-[#393939]" />
        </button>

        {/* Slider Container with animation */}
        <motion.div
          className="flex mx-16"
          initial={{ x: -100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: 100, opacity: 0 }} 
          transition={{ duration: 0.5 }} 
        >
          {/* Show skeleton loader when loading */}
          {!isError && isLoading ? (
            <div className="flex w-full">
              {Array.from({ length: visibleProducts }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-2"
                  style={{ flexBasis: `${100 / visibleProducts}%` }}
                >
                  {/* Skeleton Loader for Image */}
                  <div className="relative w-full h-[100px] bg-gray-200 animate-pulse rounded-lg shadow-lg">
                    {/* Image Icon */}
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
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Render product images if available */}
              {visibleProductItems?.length > 0 ? (
                visibleProductItems.map((product: any, index: any) => (
                  <Link
                    to={`/products/category/${product?.id}`}
                  >
                    <motion.div
                      key={index}
                      className="flex-shrink-0 w-full px-2"
                      style={{ flexBasis: `${100 / visibleProducts}%` }}
                      initial={{ opacity: 0, x: 50 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -50 }} 
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-full bg-white rounded-lg shadow-lg">
                        <img
                          src={product?.image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-[100px] object-contain rounded-md"
                        />
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="w-full text-center">Not found</div>
              )}
            </>
          )}
        </motion.div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md z-10"
        >
          <ArrowRight className="w-[24px] h-[24px] text-[#393939]" />
        </button>
      </div>
    </div>
  );
}
