import SectionWrapper from "../wrapper/SectionWrapper";

const ProductDetailsSkeleton = () => {
    return (
      <SectionWrapper>
        <div className="grid grid-cols-12 gap-5 py-10 animate-pulse">
          {/* Product Images Skeleton */}
          <div className="col-span-12 lg:col-span-6 grid grid-cols-12">
            <div className="col-span-12 mt-5 lg:mt-0 lg:col-span-3 flex gap-2 flex-row lg:flex-col items-center order-last lg:order-first">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-[50px] h-[50px]  lg:w-[118px] lg:h-[118px] p-2 lg:p-4 bg-gray-200 shadow-lg rounded-sm"
                ></div>
              ))}
            </div>
            <div className="col-span-12 lg:col-span-9">
              <div className="relative z-10 bg-gray-200 shadow-lg rounded-lg p-5 w-full lg:h-[500px] h-[200px]"></div>
            </div>
          </div>
  
          {/* Product Details Skeleton */}
          <div className="col-span-12 lg:col-span-6 space-y-5">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="flex items-center gap-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="flex gap-5 items-center">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-12 line-through"></div>
              </div>
            </div>
            <div className="py-3">
              <ul className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <li key={index} className="h-4 bg-gray-200 rounded w-3/4"></li>
                ))}
              </ul>
            </div>
            <div className="flex gap-6">
              {/* RAM Skeleton */}
              <div className="w-full space-y-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="p-3 border border-gray-300 rounded bg-gray-200"></div>
              </div>
  
              {/* COLOR Skeleton */}
              <div className="w-full space-y-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="p-3 border border-gray-300 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </SectionWrapper>
    );
  };
  
  export default ProductDetailsSkeleton;
  