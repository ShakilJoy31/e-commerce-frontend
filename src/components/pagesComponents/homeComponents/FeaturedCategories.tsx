import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import Heading from "@/components/typography/Heading";
import { Link } from "react-router-dom";

export default function FeaturedCategories() {
  const { data: categories } = useGetAllCategoryQuery({});

  return (
    <SectionWrapper className="my-6">
      <div className="border-b-2 border-primary p-2 lg:p-4 bg-gray-100 rounded-md shadow-md">
        <Heading
          align="start"
          className="text-primary text-[14px] md:text-lg lg:text-xl font-semibold tracking-wide"
          variant={"primary"}
        >
          SHOP BY CATEGORY
        </Heading>
      </div>
      <div className="flex flex-wrap justify-center gap-4 lg:gap-2 py-4">
        {categories?.data?.length > 0 &&
          categories?.data?.map((category: any, index: any) => (
            <Link to={`/category/${category?.link}`} key={index}>
              <div className="flex flex-col items-center justify-center p-3 group">
                <div className="w-16 h-16 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full transition-all duration-300 border border-transparent group-hover:border-blue-500">
                  <img
                    src={category?.image}
                    alt={category.name}
                    className="w-10 h-10 text-primary md:w-12 md:h-10 lg:w-10 lg:h-12 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-xs md:text-sm text-black font-semibold text-primary tracking-wider mt-2">
                  {category?.name}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </SectionWrapper>
  );
}
