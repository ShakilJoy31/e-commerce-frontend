import { useCart } from "@/components/context/CartContext";
import { useWishList } from "@/components/context/WishListContext";
import { selectUser } from "@/components/store/store";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/product/product";
import { extractAltText } from "@/utils/helper/extractAltText";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

interface SubCategory {
  colorId: number;
  createdAt: string;
  id: number;
  productId: number;
  subCategoryId: number;
  updatedAt: string;
  isShippedFree: boolean;
}

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  discountPrice: number;
  description?: string;
  reviews?: number;
  reviewCount?: number;
  discountPercentage?: number;
  originalPrice: number;
  stock: number;
  highlightText?: string;
  product: Product;
  isShippedFree?: boolean;
  brand: {
    id: number;
    brand: string;
    image: string;
    isShippedFree: boolean;
    BrandOffer?: {
      id: number;
      image: string;
      discountType: "FIXED" | "PERCENTAGE";
      discount: number;
    } | null;
  };

  subCategory?: SubCategory[];

  category: {
    id: number;
    name: string;
    isShippedFree: boolean;
    CategoryOffer?: {
      id: number;
      image: string;
      discountType: "FIXED" | "PERCENTAGE";
      discount: number;
    } | null;
  };
}

export default function ProductCard({
  id,
  image,
  title,
  discountPrice, 
  originalPrice,
  stock,
  brand,
  highlightText,
  category,
  subCategory,
  product,
}: ProductCardProps) {
  const { addToWish, isProductInWishList, removeFromWish } = useWishList();
  const { addToCart } = useCart();
  let finalPrice = originalPrice;
  let calculatedDiscountPrice = 0;
  let discountPercentage = 0;
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  
   const productIsFullPay = product?.isFullPay || false;
  const categoryIsFullPay = product?.category?.isFullPay || false;
  const isFullPay = productIsFullPay || categoryIsFullPay;

  const validOriginalPrice = originalPrice && originalPrice > 0;

  // Check for Category Offer first
  if (category?.CategoryOffer && category.CategoryOffer.discount > 0) {
    if (category.CategoryOffer.discountType === "FIXED" && validOriginalPrice) {
      // Fixed discount (subtract the fixed discount from originalPrice)
      calculatedDiscountPrice = category.CategoryOffer.discount;
      finalPrice = originalPrice - calculatedDiscountPrice;
      
      discountPercentage = Math.round(
        (calculatedDiscountPrice / originalPrice) * 100
      );
      
    } else if (category.CategoryOffer.discountType === "PERCENTAGE") {
      // Percentage discount (apply percentage discount on originalPrice)
      discountPercentage = Number(category.CategoryOffer.discount);
      finalPrice = originalPrice - (originalPrice * discountPercentage) / 100;
    }
  }
  
  // If no category offer, check Brand Offer
  else if (brand?.BrandOffer && brand.BrandOffer.discount > 0) {
    if (brand.BrandOffer.discountType === "FIXED" && validOriginalPrice) {
      // Fixed discount (subtract the fixed discount from originalPrice)
      calculatedDiscountPrice = brand.BrandOffer.discount;
      finalPrice = originalPrice - calculatedDiscountPrice;
      discountPercentage = Math.round(
        (calculatedDiscountPrice / originalPrice) * 100
      );
    } else if (brand.BrandOffer.discountType === "PERCENTAGE") {
      // Percentage discount (apply percentage discount on originalPrice)
      discountPercentage = Number(brand.BrandOffer.discount);
      finalPrice = originalPrice - (originalPrice * discountPercentage) / 100;
    }
  }
  // If no category or brand offer, fallback to product-level discount
  else {
    if (validOriginalPrice) {
      calculatedDiscountPrice = discountPrice;
      finalPrice = originalPrice - calculatedDiscountPrice;
      discountPercentage = Math.round(
        (calculatedDiscountPrice / originalPrice) * 100
      );
    }
  }

  const isProductInStock = () => {
    const variation = product?.VariationProduct?.[0];
    if (!variation) return false;

    return variation?.ProductColor?.some((color) => color?.inStock);
  };
  const addCardHandler = () => {
    // For products with single variation
    const variation = product?.VariationProduct[0];
    let defaultColor = null;

    for (const color of variation.ProductColor) {
      if (color?.inStock) {
        defaultColor = color;
        break;
      }
    }
    if (!defaultColor) {
      toast({
        title: "This product is not available",
      });
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
      productLink: product.productLink || `/products/${id}`,
      brand: brand,
      category: category,
      subCategory: subCategory,
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
      stock: stock || 0,
      orderType: "Order",
      isFullPay
    };


    // ✅ Track "AddToCart" with Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.productName,
      content_type: 'product',
      value: cartProduct.discountPrice,
      currency: 'BDT',
    });
  }

  // ✅ Track "AddToCart" with Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'add_to_cart', {
      currency: 'BDT',
      value: cartProduct.discountPrice,
      items: [{
        item_id: product.id,
        item_name: product.productName,
        item_brand: brand,
        item_category: category,
        item_variant: cartProduct.colorName,
        price: cartProduct.discountPrice,
        quantity: 1,
      }]
    });
  }
  
    addToCart(cartProduct);
  };

  const addBuyNowHandler = () => {
    // For products with single variation
    const variation = product?.VariationProduct?.[0];
    let defaultColor = null;

    for (const color of variation.ProductColor) {
      if (color?.inStock) {
        defaultColor = color;
        break;
      }
    }
    if (!defaultColor) {
      toast({
        title: "This product is not available",
      });
      return;
    }

    const cartProduct = {
      id: product?.id,
      image: product?.ProductImage?.[0]?.imageUrl || "",
      title: product?.productName,
      discountPrice: variation?.discountPrice || variation?.price,
      originalPrice: variation?.price - (variation?.discountPrice ?? 0),
      quantity: 1,
      //@ts-ignore
      colorName: defaultColor?.color?.color,
      //@ts-ignore
      colorId: defaultColor?.id,
      variationId: variation?.id,
      freeEmiCharge: product?.freeEmiCharge,
      isEmi: product?.isEmi,
      bookingPrice: variation?.bookingPrice || 0,
      extraWarrantyId: variation?.ExtraWarranty?.[0]?.id || null, // Safe access
      extraWarrantyPrice: variation?.ExtraWarranty?.[0]?.price || null, // Safe access
      purchasePoint: variation?.purchasePoint || 0,
      paymentMethod: "COD",
      productLink: product?.productLink || `/products/${id}`,
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
      stock: stock || 0,
      brand: brand,
      category: category,
      subCategory: subCategory,
      orderType: "Order",
      isFullPay
    };

    try {
      const result = addToCart(cartProduct);

      
      // toast({
      //   title: "Added to cart",
      //   description: `${product?.productName || title} has been added to your cart`,
      // });

      if (result !== undefined) {
        if (user?.id) {
          navigate("/checkout");
        } else {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Could not add product to cart",
      });
    }
  };
  const addPreOrder = () => {
    // For products with single variation
    const variation = product?.VariationProduct?.[0];
    let defaultColor = null;

    for (const color of variation.ProductColor) {
      if (color?.inStock===false) {
        defaultColor = color;
        break;
      }
    }
    // if (!defaultColor) {
    //   toast({
    //     title: "This product is not available",
    //   });
    //   return;
    // }

    const cartProduct = {
      id: product?.id,
      image: product?.ProductImage?.[0]?.imageUrl || "",
      title: product?.productName,
      discountPrice: variation?.discountPrice || variation?.price,
      originalPrice: variation?.price - (variation?.discountPrice ?? 0),
      quantity: 1,
      //@ts-ignore
      colorName: defaultColor?.color?.color,
      //@ts-ignore
      colorId: defaultColor?.id,
      variationId: variation?.id,
      freeEmiCharge: product?.freeEmiCharge,
      isEmi: product?.isEmi,
      bookingPrice: variation?.bookingPrice || 0,
      extraWarrantyId: variation?.ExtraWarranty?.[0]?.id || null, // Safe access
      extraWarrantyPrice: variation?.ExtraWarranty?.[0]?.price || null, // Safe access
      purchasePoint: variation?.purchasePoint || 0,
      paymentMethod: "COD",
      productLink: product?.productLink || `/products/${id}`,
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
      stock: stock || 0,
      brand: brand,
      category: category,
      subCategory: subCategory,
      orderType: "PreOrder",
    };

    try {
      const result = addToCart(cartProduct);

      // toast({
      //   title: "Added to cart",
      //   description: `${product?.productName || title} has been added to your cart`,
      // });

      if (result !== undefined) {
        if (user?.id) {
          navigate("/checkout");
        } else {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Could not add product to cart",
      });
    }
  };

  const handleWishList = () => {
    const product = {
      id,
      image,
      title,
      discountPrice: calculatedDiscountPrice,
      originalPrice,
      stock,
      time: new Date().toLocaleString(),
    };

    if (isProductInWishList(id)) {
      removeFromWish(id);
      toast({
        title: "Removed from wish list",
        description: toastMessageGenerator("delete", title),
      });
    } else {
      addToWish(product);
      toast({
        title: "Added to wish list",
        description: toastMessageGenerator("add", title),
      });
    }
  };


  return (
    <div className="relative group bg-white  shadow-lg overflow-hidden w-full min-h-[425px] flex flex-col h-full border-[1px] rounded-md">
      {/* Product Image */}
      <Link to={`/products/${id}`}>
        <div className="relative">
          <img
            src={image || ""}
            alt={extractAltText(image)}
            className="w-full h-[200px] group-hover:scale-105 duration-500 object-contain mt-5 mx-auto"
          />

          {/* 🏷️ Discount Badge */}
          {(calculatedDiscountPrice || discountPercentage > 0) && (
            <span className="absolute -top-3 left-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}

          {/* 🔥 Highlight Badge */}
          {highlightText && (
            <span className="absolute -top-3 right-1 bg-green-500 text-white text-[8px] md:text-xs font-bold px-2 py-0.5 rounded-full">
              {highlightText}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="px-4 flex-grow">
          <img
            src={brand?.image}
            alt={extractAltText(brand?.image)}
            className="w-14 h-10 object-contain mx-auto hover:scale-105 duration-500 transform transition-all"
          />
          <h3 className="text-base text-center font-bold text-black pt-1">
            {title}
          </h3>

          {/* 💰 Price Display */}
          {/* 💰 Price Display */}
          <div className="flex justify-center gap-2 md:gap-5 items-center mt-2">
            <h2 className="text-sm md:text-base text-primary flex items-center">
              <span className="font-bold">{finalPrice}</span>৳
            </h2>

            {/* Line-through Original Price */}
            {discountPercentage > 0 && (
              <h2 className="text-sm line-through text-gray-500 flex items-center">
                <span className="font-bold">{originalPrice}</span>৳
              </h2>
            )}
          </div>
        </div>
      </Link>

      {/* ❤️ Wishlist Button */}
      <FaHeart
        onClick={(event) => {
          event.stopPropagation();
          handleWishList();
        }}
        className={`absolute z-20 top-8 right-2 text-lg cursor-pointer ${
          isProductInWishList(id) ? "text-red-500" : "text-gray-400"
        }`}
      />

      {product?.VariationProduct?.length > 1 ? (
        <div className="flex w-full justify-center items-center gap-1 md:gap-3 mt-auto pt-2 pb-5">
          {" "}
          <Link to={`/products/${id}`}>
            <Button
              size="xs"
              variant={"outline"}
              className="px-4 w-full tracking-wider uppercase  py-[5px] border-primary text-primary text-xs md:text-sm  font-semibold"
            >
              Select Option
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center gap-1 md:gap-3 mt-auto pt-2 pb-5">
            <>
              {!isProductInStock() ? (
                <>
                  <Button
                    disabled={originalPrice === 0}
                    size="xs"
                    variant={"outline"}
                    className="px-3 md:px-4 py-1.5 text-xs md:text-sm "
                    onClick={addPreOrder}
                  >
                    Pre Order
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    disabled={!isProductInStock() || originalPrice === 0}
                    size="xs"
                    variant={"outline"}
                    className="px-3 md:px-4 py-1.5 text-xs md:text-sm "
                    onClick={addBuyNowHandler}
                  >
                    Buy Now
                  </Button>
                </>
              )}
            </>
            <>
              <Button
                onClick={addCardHandler}
                size="xs"
                variant={"outline"}
                disabled={!isProductInStock() || originalPrice === 0}
                className="px-1 md:px-2 py-[5px] text-xs border-primary text-primary md:text-sm"
              >
                Add To Cart
              </Button>
            </>
          </div>
        </>
      )}
      {/* 🛍️ Buttons */}
    </div>
  );
}
