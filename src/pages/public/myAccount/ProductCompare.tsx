import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useCart } from "@/components/context/CartContext";
import { useCompare } from "@/components/context/CompareContext";
import { useGetProductsQuery } from "@/components/store/api/products/productApi";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const ProductCompare = ({ setModalOpen }: any) => {
  const { selectedProducts, setSelectedProducts, productIds, setProductIds } =
    useCompare();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  console.log(selectedProducts);

  // Fetch products based on search term
  const { data: searchResults, isLoading } = useGetProductsQuery(
    { search: searchTerm },
    { skip: !searchTerm }
  );

  console.log(selectedProducts);

  // Handle product search selection
  const handleProductSelect = (product) => {
    const activeVariation = product?.VariationProduct?.[0] ?? {};

    const compareProduct = {
      ...product,
      variation: activeVariation,
    };

    const updatedProducts = [...selectedProducts];
    const updatedProductIds = [...productIds];

    if (!updatedProducts[0]) {
      updatedProducts[0] = compareProduct;
      updatedProductIds[0] = compareProduct.id;
    } else if (!updatedProducts[1]) {
      updatedProducts[1] = compareProduct;
      updatedProductIds[1] = compareProduct.id;
    } else {
      toast(
        "Both comparison slots are full! Clear one slot to add a new product."
      );
      return;
    }

    setSelectedProducts(updatedProducts);
    setProductIds(updatedProductIds);

    toast(`"${product?.productName}" added to compare`);
    setSearchTerm("");
  };

  // Clear product from comparison slot
  const clearSlot = (index) => {
    const updatedProducts = [...selectedProducts];
    const updatedProductIds = [...productIds];
    updatedProducts[index] = null;
    updatedProductIds[index] = null;
    setSelectedProducts(updatedProducts);
    setProductIds(updatedProductIds);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addCardHandler = (product) => {
    // For products with single variation
    const variation = product.VariationProduct[0];
    let defaultColor = null;

    for (const color of variation.ProductColor) {
      if (color?.inStock) {
        defaultColor = color;
        break;
      }
    }
    if (!defaultColor) {
      toast.error("This product is not available");
      return;
    }

    const cartProduct = {
      id: product.id,
      image: product?.ProductImage[0]?.imageUrl || "",
      title: product.productName,
      discountPrice: variation?.discountPrice || variation.price,
      originalPrice: variation?.price - (variation?.discountPrice ?? 0),
      freeEmiCharge: product?.freeEmiCharge,
      isEmi: product?.isEmi,
      quantity: 1,
      //@ts-ignore
      colorName: defaultColor?.color?.color,
      //@ts-ignore
      colorId: defaultColor?.id,
      variationId: variation?.id,
      bookingPrice: variation.bookingPrice || 0,
      extraWarrantyId: variation?.ExtraWarranty?.[0]?.id || null,
      extraWarrantyPrice: variation?.ExtraWarranty?.[0]?.price || null,
      purchasePoint: variation?.purchasePoint || 0,
      paymentMethod: "COD",
      productLink: product.productLink || `/products/${product?.id}`,
      brand: product?.brand,
      category: product?.category,
      subCategory: product?.subCategory,
      ramRom:
        variation?.ram && variation?.rom
          ? `${variation.ram}GB/${variation.rom}GB`
          : null,
      sim: variation?.sim || null,
      isShippedFree: variation?.isShippedFree || null,
      extraWarrantyName: null,
      chipset: null,
      region: null,
      inSideDeliveryCharge: product?.inSideDeliveryCharge || 0,
      outSideDeliveryCharge: product?.outSideDeliveryCharge || 0,
      stock: product?.stock || 0,
    };

    addToCart(cartProduct);
    setModalOpen(false);
  };

  return (
    <SectionWrapper className="max-w-5xl mx-auto my-16">
      {/* Search Section */}
      <div className="mb-4 w-full lg:w-4/5 mx-auto relative">
        <input
          type="text"
          placeholder="Search for a product..."
          className="border rounded-lg px-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div className="absolute w-full bg-white border rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg z-10">
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
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <th key={index} className="p-4 text-center">
                    {product ? (
                      <div className="flex flex-col items-center">
                        {product.title}
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
            {/* Price Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Product Name</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product ? `${product?.productName}` : "-"}
                  </td>
                ))}
            </tr>
            {/* Image Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Image</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product ? (
                      <img
                        src={product?.ProductImage[0]?.imageUrl || ""}
                        alt={product.title}
                        className="w-32 mx-auto"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
            </tr>

            {/* Price Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Price</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product ? `${product?.VariationProduct[0]?.price} ৳` : "-"}
                  </td>
                ))}
            </tr>

            {/* Discount Price Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Discount Price</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product
                      ? `${product?.VariationProduct[0]?.discountPrice} ৳`
                      : "-"}
                  </td>
                ))}
            </tr>

            {/* Booking Price Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Booking Price</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product
                      ? `${product?.VariationProduct[0]?.bookingPrice} ৳`
                      : "-"}
                  </td>
                ))}
            </tr>

            {/* Brand Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Brand</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product ? product?.brand?.brand : "-"}
                  </td>
                ))}
            </tr>

            {/* RAM Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">RAM</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product?.VariationProduct[0]?.ram
                      ? `${product?.VariationProduct[0]?.ram} GB`
                      : "-"}
                  </td>
                ))}
            </tr>

            {/* Storage Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Storage</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product?.VariationProduct[0]?.rom
                      ? `${product?.VariationProduct[0]?.rom}`
                      : "-"}
                  </td>
                ))}
            </tr>
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">SIM</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product?.VariationProduct[0]?.sim
                      ? `${
                          product?.VariationProduct[0]?.sim
                            ? product?.VariationProduct[0]?.sim
                            : ""
                        }`
                      : "-"}
                  </td>
                ))}
            </tr>
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Region</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product?.VariationProduct[0]?.region
                      ? `${
                          product?.VariationProduct[0]?.region
                            ? product?.VariationProduct[0]?.region
                            : ""
                        }`
                      : "-"}
                  </td>
                ))}
            </tr>

            {/* Description Row */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium">Description</td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
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

            {/* Add to Cart Button */}
            <tr className="border-t">
              <td className="p-4 text-gray-600 font-medium"></td>
              {selectedProducts?.length > 0 &&
                selectedProducts?.map((product, index) => (
                  <td key={index} className="p-4 text-center">
                    {product ? (
                      <div className="flex flex-col gap-2">
                        {product?.VariationProduct?.length > 1 ? (
                          <Link to={`/products/${product?.productLink}`}>
                            <Button
                              onClick={(e) => {
                                // e.preventDefault();
                                e.stopPropagation();
                                setModalOpen(false);
                              }}
                              size="xs"
                              variant={"outline"}
                              className="px-4 w-full tracking-wider uppercase  py-[5px] border-primary text-primary text-xs md:text-sm  font-semibold"
                            >
                              Select Option
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addCardHandler(product);
                            }}
                            className="bg-blue-500 text-white px-4 h-8 rounded-md hover:bg-blue-600"
                          >
                            Add To Cart
                          </Button>
                        )}

                        <Link to={`/products/${product.productLink}`}>
                          <Button
                            variant="outline"
                            className="px-4 py-2 rounded-md"
                            onClick={(e) => {
                              // e.preventDefault();
                              e.stopPropagation();
                              setModalOpen(false);
                            }}
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  );
};

export default ProductCompare;
