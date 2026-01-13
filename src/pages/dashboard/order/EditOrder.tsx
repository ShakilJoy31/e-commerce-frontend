/* eslint-disable @typescript-eslint/no-unused-vars */
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useOrder } from "@/components/context/OrderContext";
import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useLazyVerifyCouponQuery } from "@/components/store/api/discountApi/discountApi";
import { useGetBanksQuery } from "@/components/store/api/emi/bankApi";
import { useGetEmisQuery } from "@/components/store/api/emi/emiApi";
import Input from "@/components/ui/input";
import {
  useEditOrderMutation,
  useGetSingleOrderQuery,
} from "@/components/store/api/order/orderApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";
import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgMathMinus, CgMathPlus } from "react-icons/cg";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import { CiBank, CiDeliveryTruck, CiMobile1 } from "react-icons/ci";
import SearchProductForEditOrder from "./SearchProductForEditOrder";
import CreateOrderAddress from "./CreateOrderAddress";
import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi";
import { useGetShippingMethodsQuery } from "@/components/store/api/shippingMethod/shippingMethodApi";
import { useGetBranchesQuery } from "@/components/store/api/branch/branchApi";
import SearchableSelect from "../products/SearchableSelect";
import OrderInvoicePrintSingle from "./OrderInvoicePrintSingle";
import { useReactToPrint } from "react-to-print";
import EditableImeiField from "./EditableImeiField";
import { FaStarOfLife } from "react-icons/fa";
import TextArea from "@/components/ui/text-area";
import { RiMastercardFill } from "react-icons/ri";
import ssl from "../../../assets/ssl.png"

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
const EditOrder = () => {
  const { id } = useParams();
  const [responseCoupon, setResponseCoupon] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [bankId, setBankId] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [emiChargeId, setEmiChargeId] = useState<number | null>(null);
  const [cartData, setCartData] = useState<any[]>([]);
  const { clearOrder, cart, addToOrder } = useOrder();
  const [inSideDhaka, setInSideDhaka] = useState<number>(60);
  const [outSideDhaka, setOutSideDhaka] = useState<number>(120);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<any>(null);
  const [selectedShipping, setSelectedShipping] = useState<
    "inside" | "outside"
  >("inside");
  const [forceFreeShipping, setForceFreeShipping] = useState(false);
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [conditionCharge, setConditionCharge] = useState<number | null>(null);
  const [triggerVerifyCoupon, { isLoading: couponLoading }] =
    useLazyVerifyCouponQuery();
  const { data: bankEmis } = useGetEmisQuery({});
  const { data: banks } = useGetBanksQuery({});
  const { data: banner } = useGetCompanyInfoAllQuery({});
  const { data: singleOrder, isLoading: singleOrderLoading } =
    useGetSingleOrderQuery(id);

  const [editOrder, { isLoading: editOrderLoading, error }] =
    useEditOrderMutation();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm();

  const handleUpdateItem = (
    productId: number,
    colorId: number,
    updates: any
  ) => {
    setCartData((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.colorId === colorId
          ? { ...item, ...updates }
          : item
      )
    );
  };
  // In EditOrder component, update the useEffect that sets initial values
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  console.log(selectedDistrict);
  useEffect(() => {
   
    if (singleOrder?.data) {
      const info = singleOrder.data.OrderShippingInfo[0];

      setValue("shippingAddress.0.name", info?.name);
      setValue("shippingAddress.0.email", info?.email);
      setValue("shippingAddress.0.cityId", info?.cityId);
      setValue("shippingAddress.0.city", info?.city);
      setValue("shippingAddress.0.zoneId", info?.zoneId);
      setValue("shippingAddress.0.zone", info?.zone);
      setValue("shippingAddress.0.areaId", info?.areaId);
      setValue("shippingAddress.0.area", info?.area);
      setValue("shippingAddress.0.address", info?.address);
      setValue("shippingAddress.0.phone", info?.phone);
      setValue("orderStatus", singleOrder?.data?.orderStatus);
      setValue("discountType", singleOrder?.data?.discountType || "");
      setValue("discount", singleOrder?.data?.discount || "");
      setValue("discount", singleOrder?.data?.discount || "");
      setValue("advanceAmount", singleOrder?.data?.paymentAmount || 0);
      setValue("note", singleOrder?.data?.note || "");

      setValue("userId", singleOrder?.data?.userId);
      setValue("customerNote", singleOrder?.data?.customerNote || "");

      // Initialize city and district for shipping method
      if (info?.city) {
        setSelectedDistrict(info.city);
        const isDhaka = info.city.toLowerCase().includes("dhaka");
        setSelectedShipping(isDhaka ? "inside" : "outside");
      }

      setDiscountAmount(singleOrder.data.couponDiscount || null);
      setResponseCoupon(singleOrder.data.coupon || "");
      console.log(singleOrder?.data?.paymentMethod)
      setSelectedPaymentMethod(singleOrder?.data?.paymentMethod);
    }
  }, [singleOrder?.data, setValue, clearOrder, addToOrder]);

  useEffect(() => {
    if (singleOrder?.data) {
      const orderItems = singleOrder.data.OrderItem.map((item) => ({
        id: item.productId,
        colorId: item.productColorId,
        variationId: item.productVariationId,
        quantity: item.quantity,
        originalPrice: item.price,
        title: item.product.productName,
        image:
          item.product.ProductImage.find(
            (img: any) => img.colorId === item.productColorId
          )?.imageUrl ||
          item.product.ProductImage[0]?.imageUrl ||
          "",
        extraWarrantyId: item.extraWarrantyId || null,
        extraWarrantyPrice: item.extraWarranty?.price || 0,
        extraWarrantyName: item.extraWarranty?.name || "",
        inSideDeliveryCharge: item.product.inSideDeliveryCharge || 120,
        outSideDeliveryCharge: item.product.outSideDeliveryCharge || 180,
        bookingPrice: item.product.bookingPrice || item.price * 0.1,
        stock: item.product.stock,
        serialNo: item?.serialNo,
        imei: item.imei,
        category: item.product.category.name,
      }));

      setCartData(orderItems);
    }
  }, [singleOrder?.data, id]);

  // Modified clear cart handler
  const clearCartHandler = useCallback(() => {
    if (cart.length > 0) {
      clearOrder();
      localStorage.removeItem("addToOrder");
      toast.success("Order cleared");
    }
  }, [clearOrder, cart.length]);

  useEffect(() => {
    if (!id && cart) {
      setCartData(cart);
    }
  }, [id, cart]);

  const updateCart = (updatedCart: any[]) => {
    setCartData(updatedCart);
    localStorage.setItem("addToOrder", JSON.stringify(updatedCart));
  };

  // Handle quantity change
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

  // Handle delete item
  const handleDelete = (item: { id: number; colorId: number }) => {
    setCartData((prevCart) => {
      if (!prevCart) return [];
      return prevCart.filter(
        (cartItem) =>
          !(cartItem.id === item.id && cartItem.colorId === item.colorId)
      );
    });
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDiscountAmount(null);
    setResponseCoupon("");
    setCouponCode("");
  };

  const insidePrice = useMemo(() => {
    return cartData.map((item) => item.inSideDeliveryCharge);
  }, [cartData]);

  const outSidePrice = useMemo(() => {
    return cartData.map((item) => item.outSideDeliveryCharge);
  }, [cartData]);

  useEffect(() => {
    if (insidePrice.length > 0) {
      const maxInsidePrice = Math.max(...insidePrice);
      setInSideDhaka(maxInsidePrice);
    }
    if (outSidePrice.length > 0) {
      const maxOutsidePrice = Math.max(...outSidePrice);
      setOutSideDhaka(maxOutsidePrice);
    }

    // Set default shipping to inside
    setSelectedShipping("inside");
  }, [insidePrice, outSidePrice]);

 
  const calculateSubtotal = useCallback(() => {
    return cartData.reduce((total, item) => {
      const itemSubtotal =
        Number(item.originalPrice - (item?.discountPrice||0)) * item.quantity +
        (item?.extraWarrantyPrice || 0) * item.quantity;
      return total + itemSubtotal;
    }, 0);
  }, [cartData]);

  // const calculateDiscountSalsmen = () => {
  //   const subTotal = calculateSubtotal();
  //   const discountType = watch("discountType");
  //   const discountAmount = watch("discount") || 0;

  //   if (discountType === "FIXED") {
  //     return Math.max(subTotal - discountAmount, 0);
  //   } else if (discountType === "PERCENTAGE") {
  //     return subTotal * (1 - Math.min(discountAmount, 100) / 100);
  //   }
  //   return subTotal;
  // };

  // const calculateDiscount = () => {
  //   const subTotal = calculateDiscountSalsmen();
  //   return subTotal - (discountAmount ?? 0);
  // };

  // const calculateBookingPrice = () => {
  //   return cartData.reduce((total, item) => {
  //     const itemBookingPrice =
  //       typeof item.bookingPrice === "string"
  //         ? Number(item.bookingPrice)
  //         : item.bookingPrice;
  //     const itemsTotal = itemBookingPrice * item.quantity;
  //     return total + itemsTotal;
  //   }, 0);
  // };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingCharge = selectedShippingMethod?.price || 0;

    const total = subtotal + shippingCharge + (conditionCharge || 0);

    return Math.round(total);
  };

  const getShippingCharge = () => {
    // If editing an existing order, use the stored shipping charge
    if (forceFreeShipping) return 0;
    if (singleOrder?.data?.shippingCharge) {
      return singleOrder.data.shippingCharge;
    }
    return selectedShipping === "inside" ? inSideDhaka : outSideDhaka;
  };

  useEffect(() => {
    const subtotal = calculateSubtotal();
    if (
      selectedPaymentMethod === "COD" &&
      selectedShippingMethod?.name === "Shipping out side Dhaka"
    ) {
      const conditionFee = subtotal * (1 / 100);
      setConditionCharge(Number(conditionFee.toFixed(0)));
    } else {
      setConditionCharge(null);
    }
  }, [calculateSubtotal, selectedPaymentMethod, selectedShippingMethod]);

  // const calculateEmiPerMonth = () => {
  //   const subtotal = calculateSubtotal();

  //   const findCharge = bankEmis?.data.find((e) => e.id === emiChargeId);
  //   const emiCharge = (subtotal * findCharge.charge) / 100;
  //   const emiPerMonth = (subtotal + emiCharge) / (findCharge?.month ?? 0);
  //   return emiPerMonth;
  // };
  const getDiscountAmount = () => {
    const subTotal = calculateSubtotal();
    const discountType =
      watch("discountType") || singleOrder?.data?.discountType;
    const discountAmount =
      watch("discount") || singleOrder?.data?.discount || 0;

    const couponDiscount = singleOrder?.data?.discountAmount || 0;

    if (discountType === "FIXED") {
      const fixedDiscount = Math.min(discountAmount, subTotal);
      return fixedDiscount;
    } else if (discountType === "PERCENTAGE") {
      const percentageDiscount =
        subTotal * (Math.min(discountAmount, 100) / 100);
      return percentageDiscount;
    }

    // If no discount type is set but there's a coupon discount
    return couponDiscount;
  };
  

  useEffect(() => {
    const subtotal = calculateSubtotal();
    const minFreeShippingPrice =
      banner?.data[0]?.shippingChargeMinimumPrice || 0;
    const maxInside = insidePrice.length > 0 ? Math.max(...insidePrice) : 60;
    const maxOutside =
      outSidePrice.length > 0 ? Math.max(...outSidePrice) : 120;

    if (selectedPaymentMethod === "SP" || selectedPaymentMethod === "OP") {
      setInSideDhaka(0);
      setOutSideDhaka(0);
      setSelectedShipping("inside");
    } else if (subtotal > minFreeShippingPrice) {
      setInSideDhaka(maxInside);
      setOutSideDhaka(maxOutside);

      const district = watch("shippingAddress.0.district");
      if (district?.toLowerCase().includes("dhaka")) {
        setSelectedShipping("inside");
      } else if (district) {
        setSelectedShipping("outside");
      } else {
        setSelectedShipping("inside");
      }
    } else {
      setInSideDhaka(0);
      setOutSideDhaka(0);
      setSelectedShipping("inside");
    }
  }, [
    insidePrice,
    outSidePrice,
    banner?.data,
    calculateSubtotal,
    watch("shippingAddress.0.district"),
    selectedPaymentMethod,
  ]);

  useEffect(() => {
    const district = watch("shippingAddress.0.district");
    const subtotal = calculateSubtotal();
    const minFreeShippingPrice =
      banner?.data[0]?.shippingChargeMinimumPrice || 0;

    if (selectedPaymentMethod === "SP" || selectedPaymentMethod === "OP") {
      setSelectedShipping("inside");
    } else if (subtotal > minFreeShippingPrice) {
      if (district?.toLowerCase().includes("dhaka")) {
        setSelectedShipping("inside");
      } else if (district) {
        setSelectedShipping("outside");
      }
    }
  }, [
    watch("shippingAddress.0.district"),
    selectedPaymentMethod,
    calculateSubtotal,
    banner?.data,
  ]);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Use your Coupon Code");
      return;
    }

    try {
      // ✅ Call the lazy query function with parameters
      const response = await triggerVerifyCoupon({
        code: couponCode,
        totalAmount: calculateSubtotal(),
      }).unwrap();

      if (response?.success) {
        setDiscountAmount(response?.data?.discount);
        setResponseCoupon(response?.data?.code);
        toast.success(
          `Congratulations! You've received a discount of TK. ${response?.data?.discount.toLocaleString()} on your order.`
        );
      } else {
        setDiscountAmount(null);
        setResponseCoupon("");
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Invalid Coupon";

      toast.error(
        `${errorMessage}. Oops! The coupon code you entered is either incorrect or has expired. Please try another one.`
      );

      setDiscountAmount(null);
      setResponseCoupon("");
    }
  };

  const { data: shippingMethod } = useGetShippingMethodsQuery({});

  // Set default shipping method when data loads
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

        console.log(availableMethods[0])
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

  console.log(selectedShippingMethod)

  const isBranchPickup = (method: any) => {
    return (
      method?.name?.toLowerCase().includes("branch pickup") || method?.id === 4
    ); // Specific ID for branch pickup
  };

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const { data: branches } = useGetBranchesQuery({});

  const handleAddProduct = async (data) => {
    if (!watch("shippingAddress.0.name")) {
      toast.error("Name Method Required");
      return;
    }

    if (!watch("shippingAddress.0.phone")) {
      toast.error("Phone number Method Required");
      return;
    }

    if (!watch("shippingAddress.0.city")) {
      toast.error("city Method Required");
      return;
    }

    if (!watch("shippingAddress.0.address")) {
      toast.error("Address Method Required");
      return;
    }
    if (!watch("orderStatus")) {
      toast.error("Order Status Method Required");
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
          watch("advanceAmount")
      ),
      totalAmount: totalAmount,
      couponDiscount: Math.floor(discountAmount ?? 0) || 0,
      discountAmount: getDiscountAmount() || 0,
      shippingCharge: getShippingCharge(),
      ...(typeof conditionCharge === "number" && {
        conditionFee: conditionCharge,
      }),
      paymentMethod: "COD",
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
            price: Number((item.originalPrice - (item?.discountPrice || 0))),
            subTotal:
              Number((item.originalPrice - (item?.discountPrice || 0))) * item.quantity +
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

    const result = await editOrder({
      id: singleOrder?.data?.id,
      data: cleanedData,
    });
    if (result?.data?.data && result?.data?.success) {
      toast.success("Order edited successfully");
      clearCartHandler();
      reset();
      navigate("/kry-admin-portal/order-list");
    }
  };

  const reactToPrintInvoice = useReactToPrint({ contentRef: invoiceRef });

  console.log(shippingMethod?.data)

  if (singleOrderLoading) {
    return <LoaderSpinner />;
  }
  return (
    <form onSubmit={handleSubmit(handleAddProduct)}>
      <SectionWrapper className=" border border-primary p-4 rounded-md my-5">
        <SearchProductForEditOrder
          cartData={cartData}
          setCartData={setCartData}
        />
      </SectionWrapper>
      <SectionWrapper className=" border border-primary p-4 rounded-md">
        {/* PRODUCT NAME */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CreateOrderAddress
            errors={errors}
            setValue={setValue}
            watch={watch}
            setSelectedDistrict={setSelectedDistrict}
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
        </div>

        <h2 className="text-lg font-semibold text-primary my-2">
          🚛 Shipping Method
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center mb-2 ml-1 mt-3">
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
            {shippingMethod?.data
              ?.filter((i: any) => {
                if (!i.isActive) return false;

                const city = watch("shippingAddress.0.city");
                const isDhaka = city?.toLowerCase().includes("dhaka");

                const isExplicitOutDhaka =
                  i.shipped === "Out_Dhaka" ||
                  (i.shipped === "In_Dhaka" &&
                    i.name.includes("out side Dhaka"));

                if (i.shipped === "Both") return true;
                if (
                  isDhaka &&
                  i.shipped === "In_Dhaka" &&
                  !i.name.includes("out side Dhaka")
                )
                  return true;
                if (!isDhaka && isExplicitOutDhaka) return true;

                return false;
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
                      {item?.price === 0 ? "FREE" : `${item?.price}৳`}
                    </p>
                  </label>

                  {selectedShippingMethod?.id === item.id &&
                    isBranchPickup(item) && (
                      <div className="-mt-2">
                        <InputWrapper
                          label="Select Branch"
                          labelFor="branchId"
                          error={
                            errors?.shippingAddress?.[0]?.branchId?.message
                          }
                        >
                          <SearchableSelect
                            label="Branch"
                            labelFor="branch"
                            value={
                              watch("branchId")?.toString() || selectedBranch
                            }
                            onValueChange={(value: string) => {
                              const numericValue = Number(value);
                              setValue("branchId", numericValue);
                              setSelectedBranch(value);
                            }}
                            options={branches?.data || []}
                            labelKey="name"
                            valueKey="id"
                            error={
                              errors?.shippingAddress?.[0]?.branchId?.message
                            }
                            placeholder="Select a branch location"
                          />
                        </InputWrapper>
                      </div>
                    )}
                </div>
              ))}
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
              id: "ONLINE",
              label: "Online Payments",
              icon: ssl,
            },
            {
              id: "EMI",
              label: "Payment in EMI",
              icon: <RiMastercardFill className="text-primary" size={22} />,
            },
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
              className={`flex items-center justify-between border p-3 rounded-md cursor-pointer mb-2 ${
                selectedPaymentMethod === method.id
                  ? "border-primary bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => {
                setSelectedPaymentMethod(method.id);

                if (method.id !== "EMI") {
                  setBankId(null);
                  setEmiChargeId(null);
                }
              }}
            >
              <span className="flex items-center gap-2">
                {selectedPaymentMethod === method.id ? (
                  <IoMdRadioButtonOn className="text-primary" />
                ) : (
                  <IoMdRadioButtonOff className="text-gray-500" />
                )}
                {method.label}
              </span>
              {typeof method.icon === "string" ? (
                <img
                  src={method.icon}
                  alt={method.label}
                  className="w-1/2 h-8"
                />
              ) : (
                method.icon
              )}
            </div>
          ))}

          {/* If EMI is selected, show bank and EMI options */}
          {selectedPaymentMethod === "EMI" && (
            <div>
              {/* Bank Selection */}
              <InputWrapper label="Select Bank ✽" labelFor="bankId" error={""}>
                <select
                  className="border-2 rounded-md px-2 py-2"
                  name="bank"
                  id="bank"
                  onChange={(e) => {
                    const selectedBankId = Number(e.target.value);
                    setBankId(selectedBankId);
                  }}
                >
                  <option value="">Select a bank</option>
                  {banks?.data?.map((bank: any) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </InputWrapper>

              {/* EMI Plans based on selected bank */}
              {bankId && bankEmis?.data && (
                <div>
                  <InputWrapper
                    label="Select EMI Plan ✽"
                    labelFor="bankId"
                    error={""}
                  >
                    <select
                      className="border-2 rounded-md px-2 py-2"
                      name="emi"
                      id="emi"
                      onChange={(e) => {
                        const selectedChargeId = Number(e.target.value);
                        setEmiChargeId(selectedChargeId);
                      }}
                    >
                      <option value="">Select a emi plan</option>
                      {bankEmis.data
                        .filter((emi) => emi.bankId === bankId)
                        .map((emi: any) => (
                          <option key={emi.id} value={emi.id}>
                            {emi.month} Months - EMI Charge {emi.charge}%
                          </option>
                        ))}
                    </select>
                  </InputWrapper>
                </div>
              )}
            </div>
          )}

          <h2 className="text-lg font-semibold text-primary mt-5 mb-2">
            🎟️ Discount Coupon
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
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
                    {/* Product Image */}
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
                      <span className="px-2 text-primary">{item.quantity}</span>
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

                    {/* Product Info */}
                    <div className="flex-1 px-3">
                      <p className="font-semibold text-gray-700">
                        {item.title}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {(
                          item.originalPrice - (item?.discountPrice|| 0)
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
                        <p className="text-sm text-gray-600">SIM: {item.sim}</p>
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
                        onUpdate={handleUpdateItem}
                      />
                    </div>

                    {/* Action Buttons (Edit & Delete) */}
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
                              onClick={() => handleDelete(item)}
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
              <span>TK. {calculateSubtotal()}</span>
            </div>
            {/* <div className="flex justify-between text-sm text-gray-600">
                              <span>EMI Charge:</span>
                              <span>TK. 981</span>
                            </div> */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping:</span>
              <span>{getShippingCharge()}</span>
            </div>

            {conditionCharge && conditionCharge > 0 ? (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Condition Charge:</span>
                <span>TK. {conditionCharge.toLocaleString()}</span>
              </div>
            ) : null}
            <hr />
            <div className="flex justify-between text-lg font-semibold">
              <span>Grand Total:</span>
              <span>TK. {Math.ceil(calculateTotal()).toLocaleString()}</span>
            </div>
            {getDiscountAmount() > 0 && (
              <>
                <div>
                  {watch("discountType") && watch("discount") && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        Discount (
                        {watch("discountType") === "FIXED"
                          ? "Fixed"
                          : "Percentage"}
                        ):
                      </span>
                      <span className="text-red-500">
                        -TK. {getDiscountAmount().toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <label htmlFor="" className="inline-block w-24 font-semibold">
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
              <span>Customer Payable Now:</span>
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
          {/* <p className="text-red-600">
                    {error?.data?.errorMessage?.body?.[0]?.message &&
                      formatErrorMessage(error.data.errorMessage.body[0].message)}
                  </p> */}
        </div>
      </SectionWrapper>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Tracking Details
        </h3>
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th className="py-2">Time</th>
              <th className="py-2">Note</th>
              <th className="py-2">Manage By</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {singleOrder?.data?.OrderTracking?.map((shipping, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">
                  {new Date(shipping?.createdAt).toLocaleDateString()}
                </td>
                <td>{new Date(shipping?.createdAt).toLocaleTimeString()}</td>
                <td>{shipping?.note || "N/A"}</td>
                <td>{shipping?.user?.name || ""}</td>
                <td>{shipping?.orderStatus || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end my-5">
        <div className="flex justify-between  items-center gap-2">
          {error && "data" in error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Edit Order error</AlertTitle>
              <AlertDescription>
                {(error.data as { message?: string })?.message ||
                  "Something went wrong! Please try again."}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex items-center gap-2">
            <div className="mt-4">
              <Button
                type="button"
                onClick={() => reactToPrintInvoice()}
                className="text-lg uppercase font-semibold"
              >
                Print Invoice
              </Button>
            </div>
            <Button
              type="submit"
              // disabled={
              //   !selectedPaymentMethod ||
              //   (selectedPaymentMethod === "EMI" && !bankId)
              // }
              className="w-full bg-primary text-white py-3 mt-4 text-lg font-semibold"
            >
              {editOrderLoading && <ButtonLoader />}
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
      <div className="invisible hidden -left-full">
        {singleOrder?.data && (
          <OrderInvoicePrintSingle
            ref={invoiceRef}
            orderData={singleOrder?.data}
          />
        )}
      </div>
    </form>
  );
};

export default EditOrder;
