import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import bannerbg from "../../../assets/images/icon/otherbg.png";
import { MdArrowForwardIos } from "react-icons/md";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetProductsQuery } from "@/components/store/api/products/productApi";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import ProductCard from "@/components/common/card/ProductCard";
const AppleProducts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 5,
    meta: {
      page: null,
      size: null,
      total: null,
      totalPage: null,
    },
  });
  const { data: productsData, isLoading: loadingProducts } =
    useGetProductsQuery({
      sort: pagination.sort,
      page: pagination.page,
      size: pagination.size,
      search: searchQuery,
    }) as any;
  useEffect(() => {
    if (productsData) {
      setProducts(productsData.data);
      setPagination((prev) => ({
        ...prev,
        meta: {
          page: productsData.meta.page,
          size: productsData.meta.size,
          total: productsData.meta.total,
          totalPage: productsData.meta.totalPage,
        },
      }));
    }
  }, [productsData]);

  const filteredProducts = products?.filter(
    (product: any) => product?.brand?.brand?.toLowerCase() === "apple"
  );  

  return (
    <SectionWrapper>
      <div
        className="bg-cover bg-center py-16"
        style={{
          backgroundImage: `url(${bannerbg})`,
        }}
      >
        <PageWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center ">
            Apple Products
          </h2>
          <h2 className="text-[14px] font-medium flex justify-center items-center">
            Home{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Apple
          </h2>
        </PageWrapper>
      </div>
      <div className=" mt-8">
        {loadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center min-h-screen flex flex-col items-center mt-10">
            <Heading variant="secondary" align="center">
              No products found
            </Heading>
            <Paragraph>Try adjusting your filters or search terms.</Paragraph>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5`}
          >
            {filteredProducts?.map((product: any, index: number) => (
              <div key={index}>
                <ProductCard
                  id={product.id}
                  image={product?.ProductImage[0]?.imageUrl}
                  title={product.productName}
                  stock={product?.stock || 0}
                  description={
                    product.description || "No description available"
                  }
                  product={product}
                  reviews={product.reviews || 0}
                  reviewCount={product.reviews || 0}
                  discountPrice={product.discountPrice || 0}
                  originalPrice={product.price || 0}
                  discountPercentage={product.discountPercentage || 0}
                  category={product.category}
                  brand={product.brand || undefined}
                  subCategory={product.subCategory}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default AppleProducts;
