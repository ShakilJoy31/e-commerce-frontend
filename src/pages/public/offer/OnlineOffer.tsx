import ProductCard from "@/components/common/card/ProductCard";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import DiscountTimer from "@/components/pagesComponents/productDetailsComponent/DiscountTimer";
import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi";
import Heading from "@/components/typography/Heading";
import { useRef } from "react";
import { Link } from "react-router-dom";
const OnlineOffer = ({ singleData }: any) => {
  const brandRefs = useRef<any>({});
  const { data: companyData, isLoading: isFetching } =
    useGetCompanyInfoAllQuery({});

  const handleBrandSelect = (brandId: number) => {
    brandRefs.current[brandId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (isFetching) {
    return <LoaderSpinner />;
  }
  return (
    <div className="container mx-auto px-0 lg:px-4 py-6">
      {/* Replace your existing countdown section with the DiscountTimer */}
      <div className="w-fit mx-auto">
        <DiscountTimer
          data={{
            startDate: singleData?.data?.startingDate,
            endDate: singleData?.data?.expiryDate,
            preDiscountPrice: singleData?.data?.preDiscountPrice,
            discountPrice: singleData?.data?.discount,
          }}
        />
      </div>
      {/* Brand Tags */}
      {Array.from(
        new Set(
          singleData?.data?.OfferProduct?.map(
            (offer: any) => offer.product.brand?.id
          ).filter(Boolean)
        )
      ).length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {singleData?.data?.OfferProduct?.filter(
            (offer: any, index: number, self: any[]) =>
              offer.product.brand &&
              self.findIndex(
                (o) => o.product.brand?.id === offer.product.brand?.id
              ) === index
          ).map((offer: any) => (
            <button
              key={offer.product.brand.id}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => handleBrandSelect(offer.product.brand.id)}
            >
              {offer.product.brand.brand}
            </button>
          ))}
        </div>
      )}

      {/* Display Products */}
      <div className="my-10">
        {Object.entries(
          singleData?.data?.OfferProduct?.reduce((acc: any, offer: any) => {
            const brandId = offer.product.brand?.id || "no-brand";
            if (!acc[brandId]) {
              acc[brandId] = {
                brand: offer.product.brand,
                products: [],
              };
            }
            acc[brandId].products.push(offer.product);
            return acc;
          }, {}) || {}
        ).map(([brandId, brandGroup]: [string, any]) => (
          <div
            key={brandId}
            ref={(el) =>
              brandGroup.brand && (brandRefs.current[brandGroup.brand.id] = el)
            }
            className="mb-12 scroll-mt-16"
          >
            {brandGroup.brand && (
              <Heading
                variant="primary"
                align="center"
                className="mb-7 relative after:absolute after:content-normal after:w-16 after:h-1 after:bg-primary after:left-0 after:right-0 after:mx-auto after:-bottom-3"
              >
                {brandGroup.brand.brand}
              </Heading>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4">
              {brandGroup.products.map((product: any) => {
                const variation = product?.VariationProduct?.[0];

                return (
                  <div key={product.id} className="h-full">
                    <ProductCard
                      id={product.productLink}
                      image={product?.ProductImage?.[0]?.imageUrl}
                      title={product.productName}
                      stock={variation?.ProductColor?.[0]?.stock || 0}
                      description={
                        product.description || "No description available"
                      }
                      product={product}
                      reviews={product.reviews || 0}
                      reviewCount={product.reviews || 0}
                      discountPrice={variation?.discountPrice || 0}
                      originalPrice={variation?.price || 0}
                      category={product.category}
                      brand={product.brand || undefined}
                      highlightText={product.highlightText}
                      subCategory={product.subCategory}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Display Brand, Category, and SubCategory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {singleData?.data?.BrandOffer?.map((brandOffer: any) => (
          <Link
            key={`brand-${brandOffer.brand.id}`}
            to={`/brand/${brandOffer.brand.link}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="relative h-48 w-full">
              <img
                src={brandOffer.brand.image || "/placeholder-brand.jpg"}
                alt={brandOffer.brand.brand}
                className="object-cover w-full h-full group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SPECIAL OFFER
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {brandOffer.brand.brand}
              </h3>
              <p className="text-gray-600 text-sm mt-2">{"Shop now"}</p>
              <div className="mt-3 text-primary text-sm font-medium flex items-center">
                View offers
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}

        {/* ... rest of your Category and SubCategory cards ... */}
      </div>
      {/* Display Brand, Category, and SubCategory Cards */}
      <div className="w-full my-8">
        {/* Tag Offers Section */}
        {singleData?.data?.TagOffer?.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <Heading
                variant="primary"
                className="mb-6 text-2xl lg:text-3xl text-center relative after:absolute after:content-normal after:w-16 after:h-1 after:bg-primary after:left-0 after:right-0 after:mx-auto after:-bottom-2"
                align="center"
              >
                Deals
              </Heading>

              <div className="flex justify-center items-center flex-wrap w-full gap-5 mt-10">
                {singleData.data.TagOffer.map((tagOffer: any) => {
                  // Find matching image from companyData
                  const tagImage = companyData?.data[0]?.tagOfferImage;

                  return (
                    <Link
                      key={`tag-${tagOffer.tag.id}`}
                      to={`/product-tag/${tagOffer.tag.name}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 group border border-gray-200 hover:border-blue-300 relative"
                    >
                      <div className="relative h-48 min-w-60 overflow-hidden">
                        {/* Background Image */}
                        {tagImage && (
                          <img
                            src={tagImage}
                            alt={tagOffer.tag.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}

                        {/* Gradient overlay with animation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-10 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-700" />

                        {/* Fallback background if no image */}
                        {!tagImage && (
                          <div className="absolute inset-0 bg-blue-100 opacity-30 group-hover:opacity-40 transition-opacity duration-500" />
                        )}

                        {/* Offer badge with pulse animation */}
                        <div className="absolute top-3 right-3 z-20 animate-pulse hover:animate-none">
                          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                            <span className="relative flex h-2 w-2 mr-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            LIMITED OFFER
                          </span>
                        </div>

                        {/* Tag name overlay with slide-up animation */}
                        <div className="absolute w-full bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-xs text-white/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            Click to explore {tagOffer.tag.name} collection
                          </p>
                        </div>
                      </div>

                      <div className="p-4 text-center relative z-10">
                        <div className="flex justify-center items-center space-x-1 group-hover:space-x-2 transition-all duration-300">
                          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800 group-hover:font-semibold">
                            View Offer Products
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-500 group-hover:text-blue-700 transition-all group-hover:translate-x-1 group-hover:scale-110"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-sm group-hover:blur-md transition-all duration-700"></div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineOffer;
