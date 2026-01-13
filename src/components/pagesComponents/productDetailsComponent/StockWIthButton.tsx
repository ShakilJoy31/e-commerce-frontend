/* eslint-disable react-hooks/exhaustive-deps */
import { useCart } from "@/components/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { useEffect, useState, useRef } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function StockWithButton({
  details,
  type,
  colorId,
  estimateDiscount,
  price,
  bookingPrice,
  extraWarrantyId,
  extraWarrantyPrice,
  purchasePoint,
  setQuantity,
  selectedPaymentMethod,
  instock,
  selectedRamRom,
  selectedSim,
  selectedImage,
  selectedColor,
  variationId,
  extraWarrantyName,
  chipset,
  region,
  selecteColorObj,
  isShippedFree,
  giftId,
}: any) {
  const {
    id,
    productName,
    productLink,
    inSideDeliveryCharge,
    outSideDeliveryCharge,
  } = details?.data || {};
  const navigate = useNavigate();

  const productIsFullPay = details?.data?.isFullPay || false;
  const categoryIsFullPay = details?.data?.category?.isFullPay || false;
  const isFullPay = productIsFullPay || categoryIsFullPay;

  const [count, setCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem("addToCart") || "[]");
    const existingProduct = cart.find((item: any) => item.id === id);
    return existingProduct?.quantity || 1;
  });

  setQuantity(count);

  const [cartIsSuccess, setCartIsSuccess] = useState(false);
  const { addToCart } = useCart();
  const [showAddToCartButton, setShowAddToCartButton] = useState(false);
  const buttonSectionRef = useRef(null);

  const addCardHandler = () => {
    if (!colorId) {
      toast({
        title: "Color Required",
        description: "Please select a color before adding to cart.",
      });
      return;
    } else if (!instock) {
      toast({
        title: "Out of Stock",
        description: "This product is out of stock.",
      });
      return;
    }

    const selectedVariation = details?.data?.VariationProduct?.find(
      (variation) =>
        variation.ProductColor?.some(
          (pColor) => pColor.colorId === selectedColor
        )
    );

    const selectedColorObj = selectedVariation?.ProductColor?.find(
      (pColor) => pColor.colorId === selectedColor
    );

    const selectedColorName = selectedColorObj?.color?.color || "Unknown Color";

    const product = {
      id,
      image: selectedImage,
      title: productName,
      discountPrice: estimateDiscount,
      originalPrice: price,
      brand: details?.data?.brand,
      category: details?.data?.category,
      subCategory: details?.data?.subCategory,
      quantity: count,
      colorId: colorId,
      freeEmiCharge: details?.data?.freeEmiCharge,
      isEmi: details?.data?.isEmi,
      variationId: variationId,
      colorName: selectedColorName,
      bookingPrice: bookingPrice,
      extraWarrantyId: extraWarrantyId,
      extraWarrantyPrice: extraWarrantyPrice,
      purchasePoint: purchasePoint,
      paymentMethod: selectedPaymentMethod,
      productLink: productLink,
      ramRom: selectedRamRom,
      sim: selectedSim,
      extraWarrantyName,
      orderType: "Order",
      chipset,
      region,
      isShippedFree,
      inSideDeliveryCharge,
      outSideDeliveryCharge,
      isFullPay,
      giftId,
      stock: (selecteColorObj && selecteColorObj?.stock) || 0,
    };

    // Track with Meta Pixel
    if (typeof window.fbq === "function") {
      window.fbq("track", "AddToCart", {
        content_ids: [id],
        content_name: productName,
        content_type: "product",
        value: estimateDiscount,
        currency: "BDT",
      });
    }

    // Track with Google Analytics (GA4)
    if (typeof window.gtag === "function") {
      window.gtag("event", "add_to_cart", {
        currency: "BDT",
        value: estimateDiscount,
        items: [
          {
            item_id: id,
            item_name: productName,
            item_brand: details?.data?.brand,
            item_category: details?.data?.category,
            quantity: count,
          },
        ],
      });
    }

    addToCart(product);
    setCartIsSuccess(true);
  };

  const handleIncrease = () => {
    setCount((prev: any) => prev + 1);
  };

  const handleDecrease = () => {
    setCount((prev: any) => (prev > 1 ? prev - 1 : 1));
  };

  const handleBuyNow = () => {
    const selectedVariation = details?.data?.VariationProduct?.find(
      (variation) =>
        variation.ProductColor?.some(
          (pColor) => pColor.colorId === selectedColor
        )
    );

    const selectedColorObj = selectedVariation?.ProductColor?.find(
      (pColor) => pColor.colorId === selectedColor
    );

    const selectedColorName = selectedColorObj?.color?.color || "Unknown Color";
    const product = {
      id,
      image: selectedImage,
      title: productName,
      discountPrice: estimateDiscount,
      originalPrice: price,
      quantity: count,
      brand: details?.data?.brand,
      category: details?.data?.category,
      subCategory: details?.data?.subCategory,
      colorId: colorId,
      variationId: variationId,
      freeEmiCharge: details?.data?.freeEmiCharge,
      isEmi: details?.data?.isEmi,
      colorName: selectedColorName,
      bookingPrice: bookingPrice,
      extraWarrantyId: extraWarrantyId,
      extraWarrantyPrice: extraWarrantyPrice,
      purchasePoint: purchasePoint,
      paymentMethod: selectedPaymentMethod,
      productLink: productLink,
      ramRom: selectedRamRom,
      sim: selectedSim,
      orderType: "Order",
      extraWarrantyName,
      chipset,
      region,
      isShippedFree,
      inSideDeliveryCharge,
      outSideDeliveryCharge,
      isFullPay,
      giftId,
      stock: (selecteColorObj && selecteColorObj?.stock) || 0,
    };
    addToCart(product);
    navigate("/checkout");
  };
  const handlePreOrder = () => {
    const selectedVariation = details?.data?.VariationProduct?.find(
      (variation) =>
        variation.ProductColor?.some(
          (pColor) => pColor.colorId === selectedColor
        )
    );

    const selectedColorObj = selectedVariation?.ProductColor?.find(
      (pColor) => pColor.colorId === selectedColor
    );

    const selectedColorName = selectedColorObj?.color?.color || "Unknown Color";
    const product = {
      id,
      image: selectedImage,
      title: productName,
      discountPrice: estimateDiscount,
      originalPrice: price,
      quantity: count,
      brand: details?.data?.brand,
      category: details?.data?.category,
      subCategory: details?.data?.subCategory,
      colorId: colorId,
      variationId: variationId,
      freeEmiCharge: details?.data?.freeEmiCharge,
      isEmi: details?.data?.isEmi,
      colorName: selectedColorName,
      bookingPrice: bookingPrice,
      extraWarrantyId: extraWarrantyId,
      extraWarrantyPrice: extraWarrantyPrice,
      purchasePoint: purchasePoint,
      paymentMethod: selectedPaymentMethod,
      productLink: productLink,
      ramRom: selectedRamRom,
      orderType: "PreOrder",
      sim: selectedSim,
      extraWarrantyName,
      chipset,
      region,
      isShippedFree,
      inSideDeliveryCharge,
      outSideDeliveryCharge,
      stock: (selecteColorObj && selecteColorObj?.stock) || 0,
    };
    addToCart(product);
    navigate("/checkout");
  };

  useEffect(() => {
    if (cartIsSuccess) {
      toast({
        title: "Add to cart",
        description: toastMessageGenerator("add", productName),
      });
      setCartIsSuccess(false);
    }
  }, [cartIsSuccess, productName]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setShowAddToCartButton(true);
        } else {
          setShowAddToCartButton(false);
        }
      },
      { threshold: 0.1 }
    );

    if (buttonSectionRef.current) {
      observer.observe(buttonSectionRef.current);
    }

    return () => {
      if (buttonSectionRef.current) {
        observer.unobserve(buttonSectionRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full">
      {/* Main Content */}
      <div
        className="flex items-center justify-center gap-3 mb-4"
        ref={buttonSectionRef}
      >
        {type !== "Upcoming" && (
          <>
            {" "}
            {/* Quantity Selector */}
            <div className="border border-blue-500 flex items-center justify-between rounded-full px-4 py-1">
              <button
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                onClick={handleDecrease}
                disabled={count <= 1}
              >
                <FaMinus className="w-3" />
              </button>
              <span className="text-lg font-semibold px-4">{count}</span>
              <button
                disabled={
                  instock &&
                  selecteColorObj &&
                  selecteColorObj?.stock > 0 &&
                  selecteColorObj?.stock <= count
                }
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                onClick={handleIncrease}
              >
                <FaPlus className="w-3" />
              </button>
            </div>
            {/* Add to Cart Button */}
            <Button
              disabled={
                !instock || !colorId || type === "Upcoming" || price === 0
              }
              size="large"
              onClick={addCardHandler}
              className="rounded-full bg-primary text-white font-medium py-3 px-6 flex items-center justify-center"
            >
              Add to Cart
            </Button>
            {/* Buy Now Button */}
            {!instock ? (
              <>
                <Button
                  disabled={!colorId || price === 0}
                  size="large"
                  variant={"outline"}
                  className="px-6 py-3 lg:block hidden rounded-full w-full border border-blue-500 text-blue-600 font-semibold"
                  onClick={handlePreOrder}
                >
                  Pre Order
                </Button>
              </>
            ) : (
              <>
                <Button
                  disabled={
                    !instock || !colorId || type === "Upcoming" || price === 0
                  }
                  size="large"
                  variant={"outline"}
                  className="px-6 py-3 lg:block hidden rounded-full w-full border border-blue-500 text-blue-600 font-semibold"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </>
            )}
          </>
        )}
      </div>
      <div>
        {!instock ? (
          <>
            <Button
              disabled={!colorId || price === 0}
              size="large"
              variant={"outline"}
              className="px-6 py-3 block lg:hidden rounded-full w-full border border-blue-500 text-blue-600 font-semibold"
              onClick={handlePreOrder}
            >
              Pre Order
            </Button>
          </>
        ) : (
          <>
            <Button
              disabled={
                !instock || !colorId || type === "Upcoming" || price === 0
              }
              size="large"
              variant={"outline"}
              className="px-6 py-3 block lg:hidden rounded-full w-full border border-blue-500 text-blue-600 font-semibold"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </>
        )}
      </div>

      {/* Add to Cart Button at the Bottom */}
      {showAddToCartButton && (
        <div className="fixed bottom-[52px] lg:bottom-3 w-full lg:w-fit px-3 left-0 lg:left-auto right-0 lg:right-20 z-50">
          {type !== "Upcoming" && (
            <div className="bg-white border-primary border flex items-center justify-between gap-2 p-2 lg:gap-5 lg:p-3 rounded-md max-w-md mx-auto lg:mx-0 shadow-lg">
              <Button variant={"outline"} className="flex-1 lg:flex-none">
                <p className="font-semibold text-sm lg:text-base">
                  Total Price: {estimateDiscount.toLocaleString("en-IN")} ৳
                </p>
              </Button>

              <Button
                variant={"default"}
                onClick={addCardHandler}
                disabled={
                  !instock || !colorId || type === "Upcoming" || price === 0
                }
                className="flex-1 lg:flex-none text-sm lg:text-base"
              >
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
