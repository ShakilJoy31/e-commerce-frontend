import InputWrapper from "@/components/common/wrapper/InputWrapper";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useLazyVerifyCouponQuery } from "@/components/store/api/discountApi/discountApi";
import { useAdminOrderMutation } from "@/components/store/api/order/orderApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
// import ssl from "../../../assets/ssl.png";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";
import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiBank, CiDeliveryTruck, CiMobile1 } from "react-icons/ci";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import SearchProduct from "./SearchProduct";
import { useOrder } from "@/components/context/OrderContext";
import { CgMathMinus, CgMathPlus } from "react-icons/cg";
import Input from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FiTrash2 } from "react-icons/fi";
import CreateOrderAddress from "./CreateOrderAddress";
import { useGetShippingMethodsQuery } from "@/components/store/api/shippingMethod/shippingMethodApi";
import SearchableSelect from "../products/SearchableSelect";
import { FaStarOfLife } from "react-icons/fa";
import { useGetBranchesQuery } from "@/components/store/api/branch/branchApi";
import { useToast } from "@/components/ui/use-toast";
import EditableImeiField from "./EditableImeiField";
import TextArea from "@/components/ui/text-area";

const statusOptions = [
  { id: 1, name: "Pending", value: "PENDING" },
  { id: 2, name: "Confirmed", value: "CONFIRMED" },
  { id: 3, name: "Cancelled", value: "CANCELLED" },
  { id: 4, name: "On Hold", value: "HOLD" },
  { id: 5, name: "Shipped", value: "SHIPPED" },
  { id: 6, name: "In Delivery", value: "IN_DELIVERY" },
  { id: 7, name: "Processing", value: "PROCESSING" },
  { id: 8, name: "Delivered", value: "DELIVERED" },
  { id: 9, name: "Completed", value: "COMPLETED" },
];
const CreateOrder = () => {
  const [responseCoupon, setResponseCoupon] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [bankId, setBankId] = useState<number | null>(null);
  const [emiChargeId, setEmiChargeId] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [addOrder, { isLoading, error }] = useAdminOrderMutation();
  const [cartData, setCartData] = useState<any[]>([]);
  const { clearOrder, removeFromOrder, cart, updateCartItem } = useOrder();
  const [conditionCharge, setConditionCharge] = useState<number | null>(null);
  const { data: shippingMethod } = useGetShippingMethodsQuery({});
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<any>(null);
  const [forceFreeShipping, setForceFreeShipping] = useState(false);

  const [triggerVerifyCoupon, { isLoading: couponLoading }] =
    useLazyVerifyCouponQuery();
  const { data: branches } = useGetBranchesQuery({});

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm();

  const name = watch("shippingAddress.0.name");
  const phone = watch("shippingAddress.0.phone");

  useEffect(() => {
    if (name) {
      setValue("name", name);
    }
    if (phone) {
      setValue("contactNo", phone);
    }
  }, [name, phone, setValue]);

  useEffect(() => {
    if (cart) {
      setCartData(cart);
    }
  }, [cart]);

  // Modify the useEffect that handles shipping methods to depend on selectedDistrict
  useEffect(() => {
    if (shippingMethod?.data?.length > 0) {
      const city = watch("shippingAddress.0.city");
      const isDhaka = city?.toLowerCase().includes("dhaka");

      // Filter available methods
      const availableMethods = shippingMethod.data.filter((i: any) => {
        if (!i.isActive) return false;

        // Skip branch pickup for automatic selection
        if (i.name.toLowerCase().includes("branch pickup")) return false;

        if (i.shipped === "Both") return true;

        if (isDhaka) {
          return (
            i.shipped === "In_Dhaka" &&
            !i.name.toLowerCase().includes("out side dhaka")
          );
        } else {
          return (
            i.shipped === "Out_Dhaka" ||
            (i.shipped === "In_Dhaka" &&
              i.name.toLowerCase().includes("out side dhaka"))
          );
        }
      });

      if (availableMethods.length > 0) {
        // For Dhaka - prioritize "Shipping in Dhaka"
        if (isDhaka) {
          const dhakaShippingMethod = availableMethods.find(
            (method) =>
              method.name.toLowerCase().includes("shipping in dhaka") ||
              method.name.toLowerCase().includes("dhaka shipping")
          );
          if (dhakaShippingMethod) {
            setSelectedShippingMethod(dhakaShippingMethod);
            return;
          }
        }
        // For non-Dhaka - prioritize "Shipping out side Dhaka"
        else {
          const outDhakaShippingMethod = availableMethods.find(
            (method) =>
              method.name.toLowerCase().includes("out side dhaka") ||
              method.shipped === "Out_Dhaka"
          );
          if (outDhakaShippingMethod) {
            setSelectedShippingMethod(outDhakaShippingMethod);
            return;
          }
        }

        // Fallback to first available method
        setSelectedShippingMethod(availableMethods[0]);
      } else {
        // If no standard shipping methods found, fallback to branch pickup
        const branchPickup = shippingMethod.data.find((method) =>
          method.name.toLowerCase().includes("branch pickup")
        );
        if (branchPickup) setSelectedShippingMethod(branchPickup);
      }
    }
  }, [shippingMethod, watch("shippingAddress.0.city")]);

  useEffect(() => {
    // Set other default values...
    setValue("discountType", "FIXED");
  }, [setValue]);

  const defaultShippingMethod = shippingMethod?.data?.filter(
    (s) => s.name === "Branch pickup"
  );

  const isDhakaAddress = (city: string | undefined) => {
    return city?.toLowerCase() === "dhaka";
  };

  const checkAllItemsFreeShipping = useCallback(() => {
    if (cartData.length === 0) return false;
    return cartData.every((item) => {
      if (typeof item.isShippedFree !== "undefined") return item.isShippedFree;
      if (item.brand?.isShippedFree) return true;
      if (item.category?.isShippedFree) return true;
      return false;
    });
  }, [cartData]);

  const getShippingCharge = () => {
    if (forceFreeShipping || checkAllItemsFreeShipping()) return 0;
    return selectedShippingMethod?.price || 0;
  };

  const updateCart = (updatedCart: any[]) => {
    setCartData(updatedCart);
    localStorage.setItem("addToOrder", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (
    productId: number,
    colorId: number,
    delta: number
  ) => {
    const updatedCart = cartData?.map((item) =>
      item.id === productId && item.colorId === colorId
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );
    updateCart(updatedCart);
  };

  const handleDelete = (productId: number, colorId: number) => {
    removeFromOrder(productId, colorId);
    const updatedCart = cartData.filter(
      (item) => item.id !== productId || item.colorId !== colorId
    );
    updateCart(updatedCart);
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDiscountAmount(null);
    setResponseCoupon("");
    setCouponCode("");
  };

  const clearCartHandler = () => {
    clearOrder();
    setCartData([]);
  };

  const calculateSubtotal = useCallback(() => {
    return cartData.reduce((total, item) => {
      const itemSubtotal =
        Number(item.originalPrice - item?.discountPrice) * item.quantity +
        (item?.extraWarrantyPrice || 0) * item.quantity;
      return total + itemSubtotal;
    }, 0);
  }, [cartData]);

  // const calculateTotalBookingPrice = () => {
  //   const subTotal = calculateSubtotal();
  //   if (subTotal > 5000) {
  //     return (subTotal * 10) / 100;
  //   } else {
  //     return cartData.reduce((sum, item) => {
  //       return (
  //         sum + (item.bookingPrice > 0 ? item.bookingPrice * item.quantity : 0)
  //       );
  //     }, 0);
  //   }
  // };

  // const calculateTotal = () => {
  //   const subtotal = calculateSubtotal();
  //   const shippingCharge = selectedShippingMethod?.price || 0;

  //   const total = subtotal + shippingCharge + (conditionCharge || 0);

  //   return Math.round(total);
  // };
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingCharge = getShippingCharge();
    const total = subtotal + shippingCharge + (conditionCharge || 0);
    return Math.round(total);
  };

  const getDiscountAmount = () => {
    const subTotal = calculateSubtotal();
    const discountType = watch("discountType");
    const discountAmount = watch("discount") || 0;

    if (discountType === "FIXED") {
      return Math.min(discountAmount, subTotal);
    } else if (discountType === "PERCENTAGE") {
      return subTotal * (Math.min(discountAmount, 100) / 100);
    }

    return 0;
  };

  useEffect(() => {
  const subtotal = calculateSubtotal();
  const advanceAmount = Number(watch("advanceAmount")) || 0;

  if (
    selectedPaymentMethod === "COD" &&
    selectedShippingMethod?.name === "Shipping out side Dhaka"
  ) {
    const conditionFee =
      (subtotal - (discountAmount ?? 0) - getDiscountAmount() - advanceAmount) *
      (1 / 100);

    setConditionCharge(Number(conditionFee.toFixed(0)));
  } else {
    setConditionCharge(null);
  }
}, [
  calculateSubtotal,
  discountAmount,
  getDiscountAmount,
  selectedPaymentMethod,
  selectedShippingMethod,
  watch("advanceAmount"), 
]);


  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast({
        title: "Use your Coupon Code",
        description: "Please use your coupon code.",
      });
      return;
    }

    try {
      const response = await triggerVerifyCoupon({
        code: couponCode,
        totalAmount: calculateSubtotal(),
      }).unwrap();

      if (response?.success) {
        setDiscountAmount(response?.data?.discount);
        setResponseCoupon(response?.data?.code);
        toast({
          title: `Congratulations! You've received a discount of TK. ${response?.data?.discount.toLocaleString()} on your order.`,
        });
      } else {
        setDiscountAmount(null);
        setResponseCoupon("");
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Invalid Coupon";

      toast({
        title: `${errorMessage}. Oops! The coupon code you entered is either incorrect or has expired. Please try another one.`,
      });

      setDiscountAmount(null);
      setResponseCoupon("");
    }
  };

  const isBranchPickup = (method: any) => {
    return (
      method?.name?.toLowerCase().includes("branch pickup") || method?.id === 4
    ); // Specific ID for branch pickup
  };
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const { toast } = useToast();

  const handleAddProduct = async (data) => {
    if (!watch("shippingAddress.0.name")) {
      toast({
        title: "Name Method Required",
        description: "Please select a name method.",
      });
      return;
    }

    if (!watch("shippingAddress.0.phone")) {
      toast({
        title: "Phone number Method Required",
        description: "Please select a phone number method.",
      });
      return;
    }

    if (!watch("shippingAddress.0.city")) {
      toast({
        title: "city Method Required",
        description: "Please select a city method.",
      });
      return;
    }

    if (!watch("shippingAddress.0.address")) {
      toast({
        title: "Address Method Required",
        description: "Please select a address method.",
      });
      return;
    }
    const address = watch("shippingAddress.0.address");

    if (!address || address.trim().length < 10) {
      toast({
        title: "Address Required",
        description: "Address must be at least 10 characters long.",
      });
      return;
    }
    if (!watch("orderStatus")) {
      toast({
        title: "Order Status Method Required",
        description: "Please select a orderStatus method.",
      });
      return;
    }
    const subtotal = calculateSubtotal();
    const shippingCharge = getShippingCharge();
    const conditionFee = conditionCharge || 0;
    const totalAmount = Math.ceil(
      subtotal +
        shippingCharge +
        conditionFee -
        Math.floor(discountAmount ?? 0) -
        getDiscountAmount() || 0
    );

    const updateData = {
      ...data,
      shippingAddress: [
        removeFalsyValuesProperties(
          {
            name: data.shippingAddress[0].name,
            email: data.shippingAddress[0].email || "",
            cityId: Number(data.shippingAddress[0].cityId),
            city: data.shippingAddress[0].city,
            zoneId: Number(data.shippingAddress[0].zoneId),
            zone: data.shippingAddress[0].zone,
            areaId: Number(data.shippingAddress[0].areaId),
            area: data.shippingAddress[0].area,
            address: data.shippingAddress[0].address,
            phone: data.shippingAddress[0].phone,
          },
          ["email"]
        ),
      ],
      ...(isBranchPickup(selectedShippingMethod) &&
        selectedBranch && {
          branchId: Number(selectedBranch),
        }),
      ...(responseCoupon && { coupon: responseCoupon }),
      // Only include bankId if it has a value, otherwise omit it completely
      ...(bankId && { bankId: Number(bankId) }),
      // Only include emiChargeId if it has a value, otherwise omit it completely
      ...(emiChargeId && { emiChargeId: Number(emiChargeId) }),
      shippingMethod: selectedShippingMethod?.name || "",
      paymentAmount: Math.ceil(
        calculateTotal() -
          Math.floor(discountAmount ?? 0) -
          Math.ceil(getDiscountAmount() || 0) -
          (watch("advanceAmount") || 0)
      ),
      totalAmount: totalAmount,
      couponDiscount: Math.floor(discountAmount ?? 0) || 0,
      discountAmount: getDiscountAmount() || 0,
      shippingCharge: getShippingCharge(),
      ...(typeof conditionCharge === "number" && {
        conditionFee: conditionCharge,
      }),
      paymentMethod: selectedPaymentMethod || "COD",
      orderItems: cartData.map((item) =>
        removeFalsyValuesProperties(
          {
            productId: item.id,
            productColorId: item.colorId,
            productVariationId: item.variationId,
            quantity: item.quantity,
            imei: item.imei,
            ...(item?.giftId && { giftId: item.giftId }),
            serialNo: item.serialNo,
            price: Number(item.originalPrice - item?.discountPrice),
            subTotal:
              Number(item.originalPrice - item?.discountPrice) * item.quantity +
              (item?.extraWarrantyPrice || 0) * item.quantity +
              (conditionCharge || 0),
            ...(item?.extraWarrantyId
              ? { extraWarrantyId: Number(item.extraWarrantyId) }
              : null),
          },
          ["extraWarrantyId", "serialNo", "imei"]
        )
      ),
    };

    const cleanedData = removeFalsyValuesProperties(updateData, [
      "note",
      "coupon",
      "shippingCharge",
      "advanceAmount",
      "discountType",
      "discount",
      "branchId",
      "customerNote",
    ]);


    const result = await addOrder(cleanedData);
    if (result?.data?.data && result?.data?.success) {
      toast({
        title: "Order created successfully",
      });
      clearCartHandler();
      setDiscountAmount(null);

      reset();
    }
  };

  return (
    <PageWrapper className="bg-white shadow-lg p-4 rounded-md overflow-hidden">
      <form
        onSubmit={handleSubmit(handleAddProduct)}
        className="overflow-hidden"
      >
        <SectionWrapper className=" border border-primary p-4 rounded-md my-5">
          <SearchProduct />
        </SectionWrapper>

        <SectionWrapper className=" border border-primary p-4 rounded-md">
          {/* PRODUCT NAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CreateOrderAddress
              errors={errors}
              setValue={setValue}
              watch={watch}
              // setSelectedDistrict={setSelectedDistrict}
            />
            <InputWrapper label="" labelFor="orderStatus" error={""}>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-sm font-medium">Order Status</label>
                <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
              </div>
              <SearchableSelect
                label="Order Status"
                labelFor="orderStatus"
                value={watch("orderStatus") || ""}
                onValueChange={(value: string) => {
                  setValue("orderStatus", value);
                }}
                options={statusOptions ?? []}
                labelKey="name"
                valueKey="value"
              />
            </InputWrapper>

            {/* branchId */}
            {/* <InputWrapper label="" labelFor="orderStatus" error={""}>
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm font-medium">Branches</label> */}
            {/* <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" /> */}
            {/* </div> */}
            {/* <SearchableSelect
              label="branch"
              labelFor="branch"
              value={watch("branchId")?.toString() || ""} 
              onValueChange={(value: string) => {
                setValue("branchId", Number(value)); 
              }}
              options={
                branches?.data?.map((branch: any) => ({
                  id: branch?.id.toString(), 
                  name: branch.name,
                })) ?? []
              }
              labelKey="name"
              valueKey="id"
            />
          </InputWrapper> */}
          </div>

          <h2 className="text-lg font-semibold text-primary my-2 mt-6">
            🚛 Shipping Method
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center mb-2 ml-1">
                <input
                  type="checkbox"
                  id="freeShipping"
                  checked={forceFreeShipping}
                  onChange={(e) => setForceFreeShipping(e.target.checked)}
                  className="mr-2 h-4 w-4 text-primary rounded"
                />
                <label htmlFor="freeShipping" className="text-sm font-medium">
                  Apply Free Shipping
                </label>
              </div>
              <div className="flex flex-col gap-3">
                {watch("shippingAddress.0.cityId") ? (
                  <>
                    {shippingMethod?.data
                      ?.filter((i: any) => {
                        if (!i.isActive) return false;

                        const currentCity = watch("shippingAddress.0.city");
                        const isDhaka = isDhakaAddress(currentCity);

                        if (isDhaka && i.shipped === "Out_Dhaka") return false;
                        if (!isDhaka && i.shipped === "In_Dhaka") return false;

                        const isExplicitOutDhaka =
                          i.shipped === "Out_Dhaka" || i.shipped === "In_Dhaka";

                        if (i.shipped === "Both") return true;
                        if (isDhaka && i.shipped === "In_Dhaka") return true;
                        if (!isDhaka && isExplicitOutDhaka) return true;

                        if (isDhaka) {
                          if (checkAllItemsFreeShipping()) return i.price === 0;
                          return true;
                        } else if (currentCity) {
                          return i.name === "Shipping out side Dhaka";
                        }

                        return true;
                      })
                      .map((item) => (
                        <div key={item.id} className="flex flex-col gap-3">
                          <label
                            className={`flex items-center justify-between border p-3 rounded-md cursor-pointer ${
                              selectedShippingMethod?.id === item.id
                                ? "border-primary bg-blue-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="shippingMethod"
                                checked={selectedShippingMethod?.id === item.id}
                                onChange={() => {
                                  setSelectedShippingMethod(item);
                                  if (!isBranchPickup(item)) {
                                    setSelectedBranch("");
                                    setValue("branchId", "");
                                  }
                                }}
                                className="mr-2"
                              />
                              <p>{item.name}</p>
                            </div>
                            <p className="ml-5">
                              {checkAllItemsFreeShipping()
                                ? "FREE"
                                : item?.price === 0
                                ? "FREE"
                                : `${item?.price}৳`}
                            </p>
                          </label>

                          {selectedShippingMethod?.id === item.id &&
                            isBranchPickup(item) && (
                              <div className="-mt-2">
                                <InputWrapper
                                  label="Select Branch"
                                  labelFor="branchId"
                                  error={
                                    errors?.shippingAddress?.[0]?.branchId
                                      ?.message
                                  }
                                >
                                  <SearchableSelect
                                    label="Branch"
                                    labelFor="branch"
                                    value={
                                      watch("branchId")?.toString() ||
                                      selectedBranch
                                    }
                                    onValueChange={(value: string) => {
                                      const numericValue = Number(value);
                                      setValue("branchId", numericValue);
                                      setSelectedBranch(value);
                                    }}
                                    options={
                                      branches?.data?.filter(
                                        (b) => b.isBranchPickup === true
                                      ) || []
                                    }
                                    labelKey="name"
                                    valueKey="id"
                                    error={
                                      errors?.shippingAddress?.[0]?.branchId
                                        ?.message
                                    }
                                    placeholder="Select a branch location"
                                  />
                                </InputWrapper>
                              </div>
                            )}
                        </div>
                      ))}
                  </>
                ) : (
                  <>
                    {" "}
                    {defaultShippingMethod?.map((item) => (
                      <div key={item.id} className="flex flex-col gap-3">
                        <label
                          className={`flex items-center justify-between border p-3 rounded-md cursor-pointer ${
                            selectedShippingMethod?.id === item.id
                              ? "border-primary bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={selectedShippingMethod?.id === item.id}
                              onChange={() => {
                                setSelectedShippingMethod(item);
                                if (!isBranchPickup(item)) {
                                  setSelectedBranch("");
                                  setValue("branchId", "");
                                }
                              }}
                              className="mr-2"
                            />
                            <p>{item.name}</p>
                          </div>
                          <p className="ml-5">
                            {checkAllItemsFreeShipping()
                              ? "FREE"
                              : item?.price === 0
                              ? "FREE"
                              : `${item?.price}৳`}
                          </p>
                        </label>

                        {selectedShippingMethod?.id === item.id &&
                          isBranchPickup(item) && (
                            <div className="-mt-2">
                              <InputWrapper
                                label="Select Branch"
                                labelFor="branchId"
                                error={
                                  errors?.shippingAddress?.[0]?.branchId
                                    ?.message
                                }
                              >
                                <SearchableSelect
                                  label="Branch"
                                  labelFor="branch"
                                  value={
                                    watch("branchId")?.toString() ||
                                    selectedBranch
                                  }
                                  onValueChange={(value: string) => {
                                    const numericValue = Number(value);
                                    setValue("branchId", numericValue);
                                    setSelectedBranch(value);
                                  }}
                                  options={
                                    branches?.data?.filter(
                                      (b) => b.isBranchPickup === true
                                    ) || []
                                  }
                                  labelKey="name"
                                  valueKey="id"
                                  error={
                                    errors?.shippingAddress?.[0]?.branchId
                                      ?.message
                                  }
                                  placeholder="Select a branch location"
                                />
                              </InputWrapper>
                            </div>
                          )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="">
              <label className="inline-block pb-2">Note</label>
              <TextArea
                onChange={(e) => setValue("customerNote", e.target.value)}
                currentValue={watch("customerNote") || ""}
                placeHolder={"Write your note here..."}
                className="p-2"
              />
            </div>
            <div></div>
          </div>
        </SectionWrapper>

        <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border border-primary p-4 rounded-md mt-5">
          {/* Payment Method */}
          <div className="border rounded-lg shadow-md p-5 bg-white">
            <h2 className="text-lg font-semibold text-primary mb-3">
              💳 Payment Method
            </h2>

            {[
              {
                id: "COD",
                label: "Cash on Delivery",
                icon: <CiDeliveryTruck className="text-primary" size={22} />,
              },
              {
                id: "BKASH",
                label: "Pay With bKash",
                icon: <CiMobile1 className="text-primary" size={22} />,
              },
              {
                id: "BANK",
                label: "Pay with Bank",
                icon: <CiBank className="text-primary" size={22} />,
              },
            ].map((method) => (
              <div
                key={method.id}
                role="radio"
                aria-checked={selectedPaymentMethod === method.id}
                tabIndex={0}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer mb-3 transition-all
      ${
        selectedPaymentMethod === method.id
          ? "border-2 border-primary bg-blue-50 shadow-sm"
          : "border border-gray-200 hover:border-gray-300"
      }`}
                onClick={() => {
                  setSelectedPaymentMethod(method.id);
                  setBankId(null);
                  setEmiChargeId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedPaymentMethod(method.id);
                    setBankId(null);
                    setEmiChargeId(null);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {selectedPaymentMethod === method.id ? (
                    <IoMdRadioButtonOn className="text-primary text-xl" />
                  ) : (
                    <IoMdRadioButtonOff className="text-gray-400 text-xl" />
                  )}
                  <span className="font-medium text-gray-800">
                    {method.label}
                  </span>
                </div>
                <div className="flex-shrink-0">{method.icon}</div>
              </div>
            ))}

            <h2 className="text-lg font-semibold text-primary mt-5 mb-2">
              🎟️ Discount Coupon
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="border p-2 w-full rounded-md"
              />
              <Button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-primary text-white px-4 py-2"
              >
                {couponLoading && <ButtonLoader />} Apply
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg shadow-md p-5 bg-white">
            <h2 className="text-lg font-semibold text-primary mb-3">
              🛒 Order Summary
            </h2>
            <div className="border p-3 rounded-md bg-white">
              {cartData?.length > 0 && (
                <div className="flex flex-col gap-3">
                  {cartData.map((item: any) => (
                    <div
                      key={item.id + "-" + item.colorId}
                      className="flex items-center justify-between relative border px-3 py-6 rounded-md shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-md"
                      />
                      <div className="flex absolute top-1 right-1 justify-center items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item.id, item.colorId, -1)
                          }
                          className="border p-1 rounded hover:bg-gray-200"
                        >
                          <CgMathMinus />
                        </button>
                        <span className="px-2 text-primary">
                          {item.quantity}
                        </span>
                        <button
                          disabled={
                            item?.instock &&
                            item?.stock &&
                            item?.stock > 0 &&
                            item?.stock <= item?.quantity
                          }
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item.id, item.colorId, 1)
                          }
                          className="border p-1 rounded hover:bg-gray-200"
                        >
                          <CgMathPlus />
                        </button>
                      </div>

                      <div className="flex-1 px-3">
                        <p className="font-semibold text-gray-700">
                          {item.title}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {(
                            item.originalPrice - item?.discountPrice
                          ).toLocaleString()}{" "}
                          ৳
                        </p>
                        {item.colorName && (
                          <p className="text-sm text-gray-600">
                            Color: {item.colorName}
                          </p>
                        )}
                        {item.ramRom && (
                          <p className="text-sm text-gray-600">
                            RAM/ROM: {item.ramRom}
                          </p>
                        )}
                        {item.sim && (
                          <p className="text-sm text-gray-600">
                            SIM: {item.sim}
                          </p>
                        )}
                        {item.region && (
                          <p className="text-sm text-gray-600">
                            Region: {item.region}
                          </p>
                        )}
                        {item.chipset && (
                          <p className="text-sm text-gray-600">
                            Chipset: {item.chipset}
                          </p>
                        )}
                        {item?.extraWarrantyPrice > 0 ? (
                          <>
                            <p className="text-gray-500 text-sm">
                              {item.extraWarrantyPrice.toLocaleString()} ৳ (
                              {item?.extraWarrantyName})
                            </p>
                          </>
                        ) : (
                          ""
                        )}

                        <EditableImeiField
                          item={item}
                          onUpdate={updateCartItem}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <FiTrash2 className="text-red-500 cursor-pointer" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Do you want to remove this item from the cart?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="btn-destructive-fill">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(item.id, item.colorId)
                                }
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sub Total:</span>
                <span>TK. {calculateSubtotal().toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping:</span>
                <span>TK. {getShippingCharge().toLocaleString()}</span>
              </div>

              {conditionCharge && conditionCharge > 0 ? (
                <div className="flex justify-between text-red-600 text-base font-bold">
                  <span>Condition Charge:</span>
                  <span>TK. {conditionCharge.toLocaleString()}</span>
                </div>
              ) : null}

              <hr />

              <div className="flex justify-between text-lg font-semibold">
                <span>Grand Total:</span>
                <span>TK. {Math.ceil(calculateTotal()).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <label
                      htmlFor=""
                      className="inline-block w-24 font-semibold"
                    >
                      Discount Type
                    </label>
                    <select
                      className="w-32 border rounded-md p-2"
                      value={watch("discountType") || "FIXED"}
                      onChange={(e) => setValue("discountType", e.target.value)}
                    >
                      <option value="">Select Discount Type</option>
                      <option value="FIXED">Fixed Amount</option>
                      <option value="PERCENTAGE">Percentage</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <label htmlFor="" className="font-semibold">
                      Discount
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter discount amount"
                      value={watch("discount") || ""}
                      onChange={(e) =>
                        setValue("discount", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                {getDiscountAmount() > 0 && (
                  <div>
                    {watch("discountType") && watch("discount") && (
                      <span className="text-red-500">
                        -TK. {getDiscountAmount().toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {discountAmount !== null && discountAmount > 0 && (
                <>
                  <div>
                    {discountAmount !== null && discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <div>
                          <span>Discount ( Coupon ):</span>
                          <Button
                            type="button"
                            size={"xs"}
                            variant={"destructive"}
                            className="px-2"
                            onClick={handleRemoveCoupon}
                          >
                            Remove
                          </Button>
                        </div>
                        <span className="text-red-500">
                          -TK. {Math.floor(discountAmount)?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-between text-lg font-semibold">
                <span className="font-bold">Total:</span>
                <span className="font-bold">
                  TK.{" "}
                  {Math.ceil(
                    calculateTotal() -
                      Number(discountAmount ?? 0) -
                      Math.ceil(getDiscountAmount() || 0)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p>Advance Amount</p>
                <div className="w-32 flex items-center gap-1">
                  TK
                  <Input
                    placeholder="Advanced amount"
                    value={watch("advanceAmount") || 0}
                    onChange={(e) =>
                      setValue("advanceAmount", Number(e.target.value))
                    }
                  />
                </div>
              </div>
              {watch("advanceAmount") > 0 && (
                <div className="flex justify-between text-gray-600 text-lg font-semibold">
                  <span>Customer will pay on delivery:</span>
                  <span>
                    TK.{" "}
                    {Math.ceil(
                      calculateTotal() -
                        Number(discountAmount ?? 0) -
                        Math.ceil(getDiscountAmount() || 0) -
                        watch("advanceAmount")
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              {/* {selectedPaymentMethod === "COD" && (
                <>
                  {calculateTotalBookingPrice() > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Customer Advance Payment (Booking Price):</span>
                      <span>
                        TK. {calculateTotalBookingPrice().toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-base pb-3 text-gray-600">
                    <span>Payable on Delivery:</span>
                    <span>
                      TK.{" "}
                      {(
                        calculateTotal() -
                        calculateTotalBookingPrice() -
                        getShippingCharge() -
                        Math.ceil(discountAmount || 0) -
                        Math.ceil(getDiscountAmount() || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </>
              )} */}
            </div>
          </div>
        </SectionWrapper>

        <div className="flex justify-end my-5">
          <div className="flex justify-between items-center gap-2">
            {error && "data" in error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Add Order error</AlertTitle>
                <AlertDescription>
                  {(error.data as { message?: string })?.message ||
                    "Something went wrong! Please try again."}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={!selectedShippingMethod}
              className="w-full bg-primary text-white py-3 mt-4 text-lg font-semibold"
            >
              {isLoading && <ButtonLoader />}
              PLACE ORDER
            </Button>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
};

export default CreateOrder;
