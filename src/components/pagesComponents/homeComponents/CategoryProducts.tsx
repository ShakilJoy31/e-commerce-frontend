import ProductCard from "@/components/common/card/ProductCard";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import Heading from "@/components/typography/Heading";
import { Link } from "react-router-dom";

const CategoryProducts = ({categoryProducts, isLoading, companyData}) => {
 
    // console.log(companyData?.data[0])
    const smGrid = companyData?.data[0]?.smGrid;
    const mdGrid = companyData?.data[0]?.mdGrid;
    const lgGrid = companyData?.data[0]?.lgGrid;
    const gridClass = `grid grid-cols-${smGrid} md:grid-cols-${mdGrid} lg:grid-cols-${lgGrid} gap-2 md:gap-5 mt-4`;

    
// console.log(gridClass)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!categoryProducts || categoryProducts.length === 0) {
    return <></>;
  }

  return (
    <div className="mx-auto px-1">
      {CategoryProducts?.length>0 && categoryProducts?.map(
        (categoryItem: any) =>
          categoryItem?.products.length > 0 && (
            <div key={categoryItem.link} className="mb-8">
              {/* Category Header */}
              <div className="border-b-2 border-primary p-2 lg:p-4 flex items-center justify-between bg-gray-100 rounded-md shadow-md">
                <Heading
                  align="start"
                  className="text-primary text-lg lg:text-xl uppercase font-semibold tracking-wide"
                  variant="primary"
                >
                   {categoryItem.category}
                </Heading>

                <Link
                  to={`/category/${categoryItem.link}`}
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

              {/* Product Grid */}
              <div className={gridClass}>
                {categoryItem?.products?.map((product: any) => {
                  const variation = product.VariationProduct?.[0];
                  return (
                    <ProductCard
                      key={product.productLink}
                      id={product.productLink}
                      image={product?.ProductImage?.[0]?.imageUrl}
                      title={product.productName}
                      stock={product?.stock || 0}
                      product={product}
                      description={
                        product.description || "No description available"
                      }
                      category={product.category}
                      reviews={product.reviews || 0}
                      reviewCount={product.reviews || 0}
                      discountPrice={variation?.discountPrice || 0}
                      originalPrice={variation?.price || 0}
                      discountPercentage={product.discountPercentage || 0}
                      brand={product.brand || undefined}
                      highlightText={product.highlightText}
                      subCategory={product.subCategory}
                    />
                  );
                })}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default CategoryProducts;
