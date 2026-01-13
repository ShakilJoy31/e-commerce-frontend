import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import bannerbg from "../../../assets/images/icon/otherbg.png";
import { MdArrowForwardIos } from "react-icons/md";
import { useGetBrandsQuery } from "@/components/store/api/brand/brandApi";
import TopBrandsSkeleton from "@/components/common/skeleton/TopBrandSkeleton";

const TopBrands = () => {
  const { data: brands, isLoading } = useGetBrandsQuery({});

  return (
    <div className="p-6 bg-gray-50">
      <div
        className="bg-cover bg-center py-16"
        style={{
          backgroundImage: `url(${bannerbg})`,
        }}
      >
        <SectionWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center ">
            Our Top Brands
          </h2>
          <h2 className="text-[14px] font-medium flex items-center">
            Home{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Top Brands
          </h2>
        </SectionWrapper>
      </div>

      <>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
            {Array.from({ length: 8 }).map((_, index) => (
              <TopBrandsSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
            {brands?.data?.length > 0 &&
              brands?.data?.map((brand: any, index: any) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-20 h-20 object-contain mb-4"
                  />
                  <p className="text-lg font-medium text-gray-700">
                    {brand.brand}
                  </p>
                </div>
              ))}
          </div>
        )}
      </>
    </div>
  );
};

export default TopBrands;
