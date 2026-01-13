import { useGetProductsQuery } from "@/components/store/api/products/productApi";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useOrder } from "@/components/context/OrderContext";
import toast from "react-hot-toast";

const SearchProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [cartIsSuccess, setCartIsSuccess] = useState(false);
  const [variationSelections, setVariationSelections] = useState<Record<number, {
    colorId: number | null;
    colorName: string | null;
    colorPrice:number | null;
    extraWarrantyId: number | null;
    extraWarrantyName: string | null;
    extraWarrantyPrice: number | null;
  }>>({});
  console.log(selectedProduct);
  const { addToOrder } = useOrder();
  const placeholder = "Search products...";
const handleColorSelect = (variationId: number, colorId: number, colorName: string, colorPrice:number) => {
    setVariationSelections(prev => ({
      ...prev,
      [variationId]: {
        ...prev[variationId],
        colorId,
        colorName,
        colorPrice
      }
    }));
  };

  const handleWarrantySelect = (variationId: number, warrantyId: number | null, warrantyName: string | null, warrantyPrice: number | null) => {
    setVariationSelections(prev => ({
      ...prev,
      [variationId]: {
        ...prev[variationId],
        extraWarrantyId: warrantyId,
        extraWarrantyName: warrantyName,
        extraWarrantyPrice: warrantyPrice,
      }
    }));
  };

  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetProductsQuery({
    search: debouncedSearchQuery,
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

  useEffect(() => {
    if (selectedProduct) {
      const initialSelections: Record<number, any> = {};
      selectedProduct.VariationProduct?.forEach((variation: any) => {
        initialSelections[variation.id] = {
          colorId: null,
          colorName: null,
          colorPrice:null,
          extraWarrantyId: null,
          extraWarrantyName: null,
          extraWarrantyPrice: null,
        };
      });
      setVariationSelections(initialSelections);
    }
  }, [selectedProduct]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setSelectedProduct(null);
    }
  };

  const handleSuggestionClick = (product: any) => {
    setSelectedProduct(product);
    setSearchQuery(product.productName);
    setSuggestions([]);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSearchQuery("");
  };

  const addOrderHandler = (variation: any) => {
    const selection = variationSelections[variation.id];
    
    if (!selection.colorId) {
      toast.error("Please select a color");
      return;
    }

    const product = {
      id: selectedProduct?.id,
      image: selectedProduct?.ProductImage[0]?.imageUrl,
      title: selectedProduct?.productName,
      discountPrice: variation.discountPrice,
      originalPrice: variation.price,
      bookingPrice:variation.bookingPrice,
      quantity: 1,
      colorId: selection.colorId,
      colorName: selection.colorName,
      colorPrice:selection.colorPrice,
      variationId: variation.id,
      productLink: `/products/${selectedProduct.id}`,
      ramRom: variation.ram && variation.rom ? `${variation.ram}GB/${variation.rom}GB` : null,
      sim: variation.sim,
      region: variation.region,
      size: variation.size,
      extraWarrantyId: selection.extraWarrantyId,
      extraWarrantyName: selection.extraWarrantyName,
      extraWarrantyPrice: selection.extraWarrantyPrice,
      chipset: variation.chipset,
      plugType: variation.plugType,
      strapMaterial: variation.strapMaterial,
       inSideDeliveryCharge: selectedProduct.inSideDeliveryCharge || 0,
      outSideDeliveryCharge: selectedProduct.outSideDeliveryCharge || 0
    };

    addToOrder(product);
    setCartIsSuccess(true);
  };

  useEffect(() => {
    if (cartIsSuccess) {
      toast("Added to order!");
      setCartIsSuccess(false);
    }
  }, [cartIsSuccess, selectedProduct?.productName]);

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
          <h3 className="text-lg mb-4">
            Selected Product:{" "}
            <span className="font-bold">{selectedProduct.productName}</span>
          </h3>

          {selectedProduct?.VariationProduct?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProduct?.VariationProduct?.map((variation) => (
                <div
                  key={variation.id}
                  className="border p-4 rounded-lg bg-white shadow-sm"
                >
                  <div className="space-y-2">
                    {/* Display available variation attributes */}
                    {variation.ram && variation.rom && (
                      <p className="font-medium">
                        {variation.ram}GB RAM / {variation.rom}GB ROM
                      </p>
                    )}

                    {variation.chipset && <p>Chipset: {variation.chipset}</p>}
                    {variation.plugType && (
                      <p>Plug Type: {variation.plugType}</p>
                    )}
                    {variation.strapMaterial && (
                      <p>Strap Material: {variation.strapMaterial}</p>
                    )}
                    {variation.sim && <p>SIM: {variation.sim}</p>}
                    {variation.region && <p>Region: {variation.region}</p>}
                    {variation.size && <p>Size: {variation.size}</p>}

                    <div className="pt-2 border-t mt-2">
                      {variation.price && (
                        <>
                          {variation.discountPrice &&
                          variation.discountPrice !== variation.price ? (
                            <>
                              <p className="text-sm text-gray-500 line-through">
                                MRP: {variation.price.toLocaleString()}
                              </p>
                              <p className="text-green-600 font-medium">
                                Offer Price:
                                {variation.discountPrice.toLocaleString()}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-semibold">
                              Price: {variation.price.toLocaleString()}
                            </p>
                          )}
                        </>
                      )}
                      {variation.bookingPrice ? (
                        <p className="text-sm">
                          Booking: {variation.bookingPrice.toLocaleString()}
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>

                     {/* Color Selection (Required) */}
                    <div className="mt-3 border-t pt-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variation.ProductColor?.map((pc: any) => (
                          <button
                            key={pc.colorId}
                            type="button"
                            onClick={() => handleColorSelect(variation.id, pc.id, pc.color.color, pc.price)}
                            className={`px-3 py-1 text-xs rounded-full border ${
                              variationSelections[variation.id]?.colorId === pc.colorId
                                ? 'bg-blue-100 border-blue-500'
                                : 'bg-white border-gray-300'
                            }`}
                            style={{ backgroundColor: pc.color.colorCode }}
                            title={pc.color.color}
                          >
                            <span className="mix-blend-difference text-white">
                              {pc.color.color}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Extra Warranty Selection (Optional) */}
                    {variation.ExtraWarranty?.length > 0 && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Extra Warranty (Optional)
                        </label>
                        <div className="space-y-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`warranty-${variation.id}`}
                              className="form-radio"
                              checked={!variationSelections[variation.id]?.extraWarrantyId}
                              onChange={() => handleWarrantySelect(variation.id, null, null, null)}
                            />
                            <span className="ml-2">No extra warranty</span>
                          </label>
                          {variation.ExtraWarranty.map((warranty: any) => (
                            <label key={warranty.id} className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`warranty-${variation.id}`}
                                className="form-radio"
                                checked={variationSelections[variation.id]?.extraWarrantyId === warranty.id}
                                onChange={() => handleWarrantySelect(
                                  variation.id, 
                                  warranty.id, 
                                  warranty.name, 
                                  warranty.price
                                )}
                              />
                              <span className="ml-2">
                                {warranty.name} (+{warranty.price.toLocaleString()})
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                   <div className="mt-5">
                     <button
                      type="button"
                      onClick={() => addOrderHandler(variation)}
                      disabled={!variationSelections[variation.id]?.colorId}
                      className={`w-full mt-5 py-2 px-4 rounded ${
                        !variationSelections[variation.id]?.colorId
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Add to Order
                    </button>
                   </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Suggestions Dropdown */}
      {searchQuery && !selectedProduct && (
        <div className="absolute bg-white text-black w-full mt-1 rounded-md shadow-lg max-h-[300px] overflow-auto z-50">
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
