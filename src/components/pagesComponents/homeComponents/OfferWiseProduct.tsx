import ProductCard from "@/components/common/card/ProductCard";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import { useGetOfferProductsListQuery } from "@/components/store/api/products/offerProductApi";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const OfferWiseProduct = () => {
  const { offeredId } = useParams<{ offeredId: string }>();
  console.log(typeof offeredId);

  const safeOfferedId = offeredId || "";

  // Fetch offer data from the API
  const {
    data: offerData,
    isLoading,
    isError,
  } = useGetOfferProductsListQuery({});

  // Filter products based on the offeredId
  const parsedOfferedId = parseInt(safeOfferedId, 10);
  const filteredProducts = offerData?.data?.filter(
    (product: any) => product.offeredId === parsedOfferedId
  );

  console.log(filteredProducts);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 my-5 px-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-center">Error loading offer data.</p>;
  }

  if (filteredProducts?.length === 0) {
    return (
      <p className="text-center font-bold text-xl lg:text-2xl text-red-600">
        No products found for this offer.
      </p>
    );
  }

  return (
    <div className="min-h-screen px-5 lg:px-10 py-10">
      {/* <h1 className="text-xl md:text-2xl font-bold my-10">
        Products for Offer: <span className="text-primary">{offeredId}</span>
      </h1> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts?.length > 0 &&
          filteredProducts?.slice(0, 4)?.map((product: any, index: number) => {
            // Calculate discount price based on discount type
            const discount = product.offer?.discount;

            const discountType = product.offer?.discountType;

            let discountPrice = 0;

            if (discountType === "PERCENTAGE") {
              discountPrice = product.product.price * (discount / 100);
            } else if (discountType === "FIXED") {
              discountPrice = discount;
            }

            return (
              <ProductCard
                key={index}
                id={product.product.id}
                image={product.product?.ProductImage[0]?.imageUrl}
                title={product.product.productName}
                stock={product.product?.stock || 0}
                description={
                  product.product.description || "No description available"
                }
                product={product?.product}
                reviews={product.product.reviews || 0}
                reviewCount={product.product.reviews || 0}
                discountPrice={discountPrice || 0}
                originalPrice={product.product.price || 0}
                discountPercentage={product.offer?.discount || 0}
                category={product.category}
                brand={product.product.brand || undefined}
                subCategory={product.subCategory}
              />
            );
          })}
      </div>
    </div>
  );
};

export default OfferWiseProduct;
