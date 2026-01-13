import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useGetProductsQuery } from "@/components/store/api/products/productApi";
import { useGetReviewByProductQuery } from "@/components/store/api/review/reviewApi";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const CompareProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([null, null]);
  const [productIds, setProductIds] = useState([null, null]);

  const { data: searchResults, isLoading } = useGetProductsQuery(
    { search: searchTerm },
    { skip: !searchTerm }
  );
 // Only fetch reviews if the productId is not null
 const { data: reviewsData1 } = useGetReviewByProductQuery(productIds[0], {
    skip: !productIds[0],
  });
  const { data: reviewsData2 } = useGetReviewByProductQuery(productIds[1], {
    skip: !productIds[1],
  });

  const reviews1 = useMemo(() => reviewsData1?.data || [], [reviewsData1]);
  const reviews2 = useMemo(() => reviewsData2?.data || [], [reviewsData2]);

  const averageRating1 = useMemo(() => {
    if (!reviews1.length) return 0;
    const sum = reviews1.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews1.length).toFixed(1);
  }, [reviews1]);

  const averageRating2 = useMemo(() => {
    if (!reviews2.length) return 0;
    const sum = reviews2.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews2.length).toFixed(1);
  }, [reviews2]);

  console.log(averageRating1, averageRating2);

  const handleProductSelect = (product) => {
    const updatedProducts = [...selectedProducts];
    const updatedProductIds = [...productIds];
    if (!updatedProducts[0]) {
      updatedProducts[0] = product;
      updatedProductIds[0] = product?.id;
    } else if (!updatedProducts[1]) {
      updatedProducts[1] = product;
      updatedProductIds[1] = product?.id;
    } else {
      console.log("Both slots are filled. Clear one slot to add more.");
    }
    setSelectedProducts(updatedProducts);
    setProductIds(updatedProductIds);
    setSearchTerm("");
  };

  const clearSlot = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = null;
    setSelectedProducts(updatedProducts);
  };

  console.log(selectedProducts)

  return (
    <SectionWrapper className="max-w-5xl mx-auto my-16">
      {/* Search Section */}
      <div className="mb-4 w-full lg:w-1/2 mx-auto">
        <input
          type="text"
          placeholder="Search for a product..."
          className="border rounded-lg px-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div className="bg-white border rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg">
            {isLoading ? (
              <p className="text-center p-4">Loading...</p>
            ) : searchResults?.data?.length > 0 ? (
              searchResults.data.map((product) => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleProductSelect(product)}
                >
                  {product.productName}
                </div>
              ))
            ) : (
              <p className="text-center p-4 text-gray-500">No products found</p>
            )}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="p-4 text-left text-gray-600">
                <button
                  onClick={() => setSelectedProducts([null, null])}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove all
                </button>
              </th>
              {selectedProducts.map((product: any, index: any) => (
                <th key={index} className="p-4 text-center">
                  {product ? (
                    <div className="flex flex-col items-center">
                      {product?.productName}
                      <button
                        onClick={() => clearSlot(index)}
                        className="text-sm text-red-500 hover:text-red-600 mt-2"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-400">Empty Slot</p>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Image Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Image</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product ? (
                    <img
                      src={product.ProductImage[0]?.imageUrl}
                      alt={product.productName}
                      className="w-32 mx-auto"
                    />
                  ) : (
                    "-"
                  )}
                </td>
              ))}
            </tr>

            {/* Brand Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Brand</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product ? product.brand.brand : "-"}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Rating</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4">
                  {product ? (
                    <div className="flex justify-center items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            // Check the correct average rating for each product
                            index === 0
                              ? i < Number(averageRating1) // For the first product
                                ? "text-yellow-500 text-sm"
                                : "text-gray-400 text-sm"
                              : i < Number(averageRating2) // For the second product
                              ? "text-yellow-500 text-sm"
                              : "text-gray-400 text-sm"
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              ))}
            </tr>

            {/* RAM Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">RAM</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product ? `${product.VariationProduct?.[0]?.ram} GB` : "-"}
                </td>
              ))}
            </tr>

            {/* ROM Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">ROM</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product ? `${product.VariationProduct?.[0]?.rom} GB` : "-"}
                </td>
              ))}
            </tr>
            {/* Price Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Price</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product ? `${product.VariationProduct?.[0]?.price} ৳` : "-"}
                </td>
              ))}
            </tr>

            {/* Discount Price Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Discount Price</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product
                    ? `${product.VariationProduct?.[0]?.discountPrice} ৳`
                    : "-"}
                </td>
              ))}
            </tr>
            {/* Booking Price Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Booking Price</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product
                    ? `${product.VariationProduct?.[0]?.bookingPrice} ৳`
                    : "-"}
                </td>
              ))}
            </tr>

            {/* Regular Price Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Regular Price</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product
                    ? `${product.VariationProduct?.[0]?.regularPrice} ৳`
                    : "-"}
                </td>
              ))}
            </tr>

            {/* Purchase Point Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Purchase Point</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  {product
                    ? `${product.VariationProduct?.[0]?.purchasePoint} Points`
                    : "-"}
                </td>
              ))}
            </tr>

            {/* Description Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Description</td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center text-gray-500">
                  {product ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.sortDescription,
                      }}
                      className="w-full [&_img]:w-full [&_img]:h-auto"
                    />
                  ) : (
                    "_"
                  )}
                </td>
              ))}
            </tr>

            {/* Add to Cart Buttons */}
            <tr className="border-t">
              <td className="p-4"></td>
              {selectedProducts.map((product: any, index: any) => (
                <td key={index} className="p-4 text-center">
                  <Link to={`/products/product-details/${product?.id}`}>
                    <Button
                      size="xs"
                      variant={"outline"}
                      className="px-1 md:px-2 py-1 border-primary text-primary text-[11px] md:text-sm"
                    >
                      Add To Cart
                    </Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  );
};

export default CompareProduct;
