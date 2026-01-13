import { useCart } from "@/components/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const HighLightProduct = ({ highlights }: any) => {
  const { addToCart, removeFromCart } = useCart();
  const [cartData, setCartData] = useState<any[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: boolean;
  }>({});
console.log(cartData)
  
  useEffect(() => {
    const storedCart = localStorage.getItem("addToCart");
    if (storedCart) {
      setCartData(JSON.parse(storedCart));
    }
  }, []);

  // Initialize selected items based on cart
  useEffect(() => {
    const initialSelected: { [key: number]: boolean } = {};
    highlights?.forEach((product: any) => {
      const isInCart = cartData?.some((item) => item.id === product.id);
 
      initialSelected[product.id] = isInCart;
    });
    setSelectedItems(initialSelected);
  }, [cartData, highlights]);

  const toggleSelection = (product: any) => {
   
    const isSelected = selectedItems[product.id];

    const variation = product.accessories?.VariationProduct?.[0];

    if (isSelected) {
      // Remove from cart
      removeFromCart(product.id, variation?.ProductColor[0]?.id);
      toast({
        title: "Removed from cart",
        description: toastMessageGenerator(
          "delete",
          "Product removed successfully"
        ),
      });
    } else {
      // Add to cart
      let defaultColor = null;

      // Find first available color
      if (variation?.ProductColor) {
        for (const color of variation.ProductColor) {
          if (color?.inStock) {
            defaultColor = color;
            break;
          }
        }
      }

      if (!defaultColor) {
        toast({
          title: "This product is not available",
          variant: "destructive",
        });
        return;
      }

      const cartProduct = {
        id: product.id,
        image: product.accessories?.ProductImage?.[0]?.imageUrl || "",
        title: product.accessories?.productName,
        discountPrice: variation?.discountPrice || variation?.price || 0,
        originalPrice: variation?.price || 0,
        quantity: 1,
        //@ts-ignore
        colorName: defaultColor?.color?.color,
        //@ts-ignore
        colorId: defaultColor?.id,
        variationId: variation?.id,
        bookingPrice: variation?.bookingPrice || 0,
        extraWarrantyId: variation?.ExtraWarranty?.[0]?.id || null,
        extraWarrantyPrice: variation?.ExtraWarranty?.[0]?.price || null,
        productLink: `/products/${product.id}`,
        stock: variation?.stock || 0,
      };

      addToCart(cartProduct);
      toast({
        title: "Added to cart",
        description: toastMessageGenerator("add", "Product added successfully"),
      });
    }

    // Toggle selection state
    setSelectedItems((prev) => ({
      ...prev,
      [product.id]: !isSelected,
    }));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      {highlights?.map((product: any) => (
        <div key={product.id} className="flex items-center gap-3 border-b py-2">
          {/* Checkbox - Clickable */}
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            checked={selectedItems[product.id] || false}
            onChange={() => toggleSelection(product)}
          />

          {/* Product Image */}
          <img
            src={product?.accessories?.ProductImage?.[0]?.imageUrl}
            alt={product?.accessories?.productName}
            className="w-12 h-12 rounded"
          />

          {/* Product Info */}
          <div className="flex-1">
            <p>{product?.accessories?.productName}</p>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 items-center">
            <div>
              <span className="text-lg font-bold">
                {product?.accessories?.VariationProduct?.[0]?.price || 0}
              </span>{" "}
              ৳
            </div>

            {product?.accessories?.VariationProduct?.[0]?.discountPrice > 0 && (
              <span className="text-red-600 border border-red-300 px-2 rounded">
                ৳ {product?.accessories?.VariationProduct?.[0]?.discountPrice}{" "}
                Save
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Show More Button */}
      <button
        className="text-primary flex items-center mt-3 w-full justify-center"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        <span className="ml-1">{showMore ? "Show Less" : "Show More"}</span>
      </button>
    </div>
  );
};

export default HighLightProduct;
