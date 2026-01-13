import {
  useGetSearchProductsQuery,
  useGetSingleProductQuery,
} from "@/components/store/api/products/productApi";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useOrder } from "@/components/context/OrderContext";
import toast from "react-hot-toast";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import Input from "@/components/ui/input";
import GiftProducts from "@/components/pagesComponents/productDetailsComponent/GiftProducts";

const SearchProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [cartIsSuccess, setCartIsSuccess] = useState(false);
  const [imei, setImei] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [giftId, setGiftId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<{
    id: number;
    name: string;
    price: number;
  } | null>(null);
  const [selectedWarranty, setSelectedWarranty] = useState<{
    id: number;
    name: string;
    price: number;
  } | null>(null);

  const { addToOrder } = useOrder();
  const placeholder = "Search products...";

  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetSearchProductsQuery({
    search: debouncedSearchQuery,
  });

  const {
    data: productDetails,
    isLoading: isProductLoading,
  } = useGetSingleProductQuery(selectedProductId as number, {
    skip: !selectedProductId, 
  });

  useEffect(() => {
    if (debouncedSearchQuery && productsData?.data) {
      const filteredSuggestions = productsData.data.filter((product: any) => {
        const productName = product?.productName || "";
        return productName
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase());
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery, productsData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setSelectedProduct(null);
    }
  };

  const handleSuggestionClick = (product: any) => {
    setSelectedProductId(product?.productLink);
    setSelectedVariation(null);
    setSelectedColor(null); // Reset selected color
    setSelectedWarranty(null); // Reset selected warranty
    setSearchQuery(product.productName);
    setSuggestions([]);
  };

  useEffect(() => {
    if (productDetails?.data) {
      setSelectedProduct(productDetails.data);
    }
  }, [productDetails]);

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSearchQuery("");
  };

  const handleVariationSelect = (variation: any) => {
    setSelectedVariation(variation);
    setSelectedColor(null);
    setSelectedWarranty(null);
  };

  const handleColorSelect = (color: any) => {
    setSelectedColor({
      id: color.id,
      name: color.color.color,
      price: color.price || 0,
    });
  };

  const handleWarrantySelect = (warranty: any) => {
    setSelectedWarranty({
      id: warranty.id,
      name: warranty.name,
      price: warranty.price,
    });
  };

  const addOrderHandler = () => {
    if (!selectedVariation) {
      toast.error("Please select a variation");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const product = {
      id: selectedProduct?.id,
      image: selectedProduct?.ProductImage[0]?.imageUrl,
      title: selectedProduct?.productName,
      discountPrice: selectedVariation.discountPrice,
      originalPrice: selectedVariation.price,
      isEmi: selectedProduct?.isEmi,
      freeEmiCharge: selectedProduct?.freeEmiCharge,
      bookingPrice: selectedVariation.bookingPrice,
      quantity: 1,
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      colorPrice: selectedColor.price,
      variationId: selectedVariation.id,
      productLink: `/products/${selectedProduct.id}`,
      ramRom:
        selectedVariation.ram && selectedVariation.rom
          ? `${selectedVariation.ram}GB/${selectedVariation.rom}GB`
          : null,
      sim: selectedVariation.sim,
      region: selectedVariation.region,
      size: selectedVariation.size,
      giftId,
      extraWarrantyId: selectedWarranty?.id || null,
      extraWarrantyName: selectedWarranty?.name || null,
      extraWarrantyPrice: selectedWarranty?.price || null,
      chipset: selectedVariation.chipset,
      plugType: selectedVariation.plugType,
      strapMaterial: selectedVariation.strapMaterial,
      inSideDeliveryCharge: selectedProduct.inSideDeliveryCharge || 0,
      outSideDeliveryCharge: selectedProduct.outSideDeliveryCharge || 0,
      imei: imei,
      serialNo: serialNo,
      category: selectedProduct?.category?.name,
    };

    addToOrder(product);
    setCartIsSuccess(true);

    // Reset form state
    setSelectedProduct(null);
    setSelectedVariation(null);
    setSelectedColor(null);
    setSelectedWarranty(null);
    setSearchQuery("");
    setImei("");
    setSerialNo("");
  };

  useEffect(() => {
    if (cartIsSuccess) {
      toast("Added to cart!");
      setCartIsSuccess(false);
      setImei("");
    }
  }, [cartIsSuccess, selectedProduct?.productName]);

  const getVariationLabel = (variation: any) => {
    const parts: string[] = [];
    if (variation.ram && variation.rom)
      parts.push(`${variation.ram}GB/${variation.rom}GB`);
    if (variation.size) parts.push(`Size: ${variation.size}`);
    if (variation.sim) parts.push(`SIM: ${variation.sim}`);
    if (variation.chipset) parts.push(`Chipset: ${variation.chipset}`);
    if (variation.region) parts.push(`Region: ${variation.region}`);
    if (variation.strapMaterial)
      parts.push(`Material: ${variation.strapMaterial}`);
    return parts.join(" | ");
  };

  

  return (
    <div className="flex-1 mx-6 relative">
      <form onSubmit={(e) => e.preventDefault()} className="relative w-1/2">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 text-primary pr-10 py-1 border-2 border-[#ABC3E3] bg-white rounded-full text-base focus:outline-none"
              placeholder=""
            />
            {searchQuery === "" && !selectedProduct && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={placeholder}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.5 }}
                  >
                    {placeholder}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>

          {selectedProduct && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="px-3 py-1 text-sm text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Selected Product Info */}
      {selectedProduct && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          {isProductLoading ? (
            <div className="flex justify-center py-4">
              <ButtonLoader />
            </div>
          ) : (
           <div className="flex gap-10 w-full">
             <div className="w-full">
              <h3 className="text-lg mb-4">
                Selected Product:{" "}
                <span className="font-bold">{selectedProduct.productName}</span>
              </h3>

              {/* Variation Selection Dropdown */}
              <div className="mb-4 flex gap-4 w-full">
                <div className="w-full">
                  <label className="block text-sm font-bold mb-1">
                    Select Variation <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                      const variationId = Number(e.target.value);
                      const variation = selectedProduct.VariationProduct.find(
                        (v: any) => v.id === variationId
                      );
                      handleVariationSelect(variation);
                    }}
                    value={selectedVariation?.id || ""}
                  >
                    <option value="">Select a variation</option>
                    {selectedProduct.VariationProduct?.map((variation: any) => (
                      <option key={variation.id} value={variation.id}>
                        {getVariationLabel(variation)} {" "} {" "}
                        {(variation.price - variation?.discountPrice).toLocaleString()}৳
                      </option>
                    ))}
                  </select>
                </div>
                
              </div>

              {/* Color Selection (only shown when variation is selected) */}
              {selectedVariation && (
                <div className="mb-6 space-y-4">
                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Color <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedVariation.ProductColor?.map((pc: any) => (
                        <button
                          key={pc.colorId}
                          type="button"
                          onClick={() => handleColorSelect(pc)}
                          className={`px-3 py-1 text-xs rounded-full border-2 flex items-center justify-center min-w-[80px] transition-all ${
                            selectedColor?.id === pc.id
                              ? "ring-2 ring-blue-500 ring-offset-2 border-blue-600"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: pc.color.colorCode }}
                          title={pc.color.color}
                        >
                          <span className="mix-blend-difference text-white font-medium">
                            {pc.color.color}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* IMEI/Serial Number Input */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProduct?.category?.name?.toLowerCase() === "phone" ? (
                      <InputWrapper label="IMEI" labelFor="imei" error={""}>
                        <Input
                          placeholder="Enter IMEI number"
                          value={imei}
                          onChange={(e) => setImei(e.target.value)}
                        />
                      </InputWrapper>
                    ) : (
                      <InputWrapper label="Serial No" labelFor="serial" error={""}>
                        <Input
                          placeholder="Enter serial number"
                          value={serialNo}
                          onChange={(e) => setSerialNo(e.target.value)}
                        />
                      </InputWrapper>
                    )}
                  </div>
                </div>
              )}
              {/* Warranty Selection (only shown when variation is selected and has warranties) */}
              {selectedVariation?.ExtraWarranty?.length > 0 && (
                <div className="my-5">
                  <label className="block text-sm font-bold mb-1">
                    Extra Warranty (Optional)
                  </label>
                  <div className="space-y-2">
                    {selectedVariation.ExtraWarranty.map((warranty: any) => (
                      <label key={warranty.id} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="warranty"
                          className="form-radio"
                          checked={selectedWarranty?.id === warranty.id}
                          onChange={() => handleWarrantySelect(warranty)}
                        />
                        <span className="ml-2">
                          {warranty.name} (+{warranty.price.toLocaleString()}৳)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Order Button (only shown when variation and color are selected) */}
              {selectedVariation && selectedColor && (
                <button
                  type="button"
                  onClick={addOrderHandler}
                  className="w-44 mt-3 py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add to Cart
                </button>
              )}
            </div>
            <div className="w-full">
                  {selectedProduct?.ProductGift?.length > 0 ? (
                    <div>
                      <GiftProducts
                        details={selectedProduct?.ProductGift}
                        setGiftId={setGiftId}
                        giftId={giftId}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
           </div>
          )}
        </div>
      )}

      {/* Search Suggestions Dropdown */}
      {searchQuery && !selectedProduct && (
        <div className="absolute w-1/2 bg-white text-black mt-1 rounded-md shadow-lg max-h-[300px] overflow-auto z-50">
          {isLoading ? (
            <div className="pl-5">
              <ButtonLoader />
            </div>
          ) : (
            <>
              {!isLoading && !isError && suggestions?.length > 0
                ? suggestions.map((product) => (
                    <div
                      key={product.id}
                      className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      {product.productName}
                    </div>
                  ))
                : debouncedSearchQuery &&
                  !isLoading && (
                    <p className="px-4 py-2 text-sm lg:text-base font-semibold">
                      No products found
                    </p>
                  )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
