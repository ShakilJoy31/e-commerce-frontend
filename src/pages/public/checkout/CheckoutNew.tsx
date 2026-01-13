// components/checkout/CheckoutNew.tsx
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiMastercardFill } from "react-icons/ri";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import { useCart } from "@/components/context/CartContext";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import { useAddOrderMutation } from "@/components/store/api/order/orderApi";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { CiDeliveryTruck } from "react-icons/ci";
import { useToast } from "@/components/ui/use-toast";
import ssl from "../../../assets/ssl.png";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { useForm } from "react-hook-form";
import { useGetEmisQuery } from "@/components/store/api/emi/emiApi";
import { useGetBanksQuery } from "@/components/store/api/emi/bankApi";
import CheckOutAddress from "./CheckOutAddress";
import { usePaymentInstanceMutation } from "@/components/store/api/payment/paymentApi";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { formatErrorMessage } from "./FormatErrorMessage";
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
import { Link, useNavigate } from "react-router-dom";
import { useLazyVerifyCouponQuery } from "@/components/store/api/discountApi/discountApi";
import { CgMathMinus, CgMathPlus } from "react-icons/cg";
import { useGetShippingMethodsQuery } from "@/components/store/api/shippingMethod/shippingMethodApi";
import { FaStarOfLife } from "react-icons/fa";
import CheckoutNotice from "./CheckoutNotice";
import { useGetBranchesQuery } from "@/components/store/api/branch/branchApi";
import SearchableSelect from "@/pages/dashboard/products/SearchableSelect";
import { useGetSingleUserQuery } from "@/components/store/api/user/userApi";
import {
  useCreateShippingInfoMutation,
  useGetShippingInfoQuery,
  useGetPathaoCitiesQuery,
  useGetPathaoZonesQuery,
  useGetPathaoAreasQuery,
} from "@/components/store/api/shippingAddressApi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi";
import PrivacyPolicy from "./PrivacyPolicy";
import { useGetPagesQuery } from "@/components/store/api/pages/pageApi";
import ReturnPolicy from "./ReturnPolicy";
import TermsAndConditions from "./TermsAndConditions";
import { requiredStar } from "@/utils/helper/requiredStar";
import EditShippingAddress from "../myAccount/EditShippingAddress";
import { Edit } from "lucide-react";
import TextArea from "@/components/ui/text-area";

const CheckoutNew = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ONLINE");
  const { clearCart, removeFromCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<any[]>([]);
  const { data: bankEmis } = useGetEmisQuery({});
  const { data: banks } = useGetBanksQuery({});
  const user = useSelector(selectUser);
  const [agree, setAgree] = useState(true);
  const [responseCoupon, setResponseCoupon] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [bankId, setBankId] = useState<number | null>(null);
  const [emiChargeId, setEmiChargeId] = useState<number | null>(null);
  const { data: shippingMethod } = useGetShippingMethodsQuery({});
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<any>(null);
  const [conditionCharge, setConditionCharge] = useState<number | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: description } = useGetCompanyInfoAllQuery({});
  const all = "Published";
  const { data } = useGetPagesQuery({
    page: 1,
    size: 20,
    status: all,
  });
  const { data: banner } = useGetCompanyInfoAllQuery({});

  const returnPolicySlug = data?.data?.find((s) => s.slug === "return-policy");
  const privacyPolicySlug = data?.data?.find(
    (s) => s.slug === "privacy-policy"
  );
  const termsAndConditionsSlug = data?.data?.find(
    (s) => s.slug === "terms-conditions"
  );

  // For shipping address
  const { data: shippingInfo, refetch } = useGetShippingInfoQuery(undefined);
  const [createShippingInfo] = useCreateShippingInfoMutation();
  const { data: pathaoCities } = useGetPathaoCitiesQuery(undefined);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [actionItem, setActionItem] = useState(null);
  const { data: zones } = useGetPathaoZonesQuery(selectedCityId!, {
    skip: !selectedCityId,
  });
  const { data: areas } = useGetPathaoAreasQuery(selectedZoneId!, {
    skip: !selectedZoneId,
  });

  const cities = pathaoCities?.data?.data?.data || [];
  const zoneList = zones?.data?.data?.data || [];
  const areaList = areas?.data?.data?.data || [];

  const { data: singleUser } = useGetSingleUserQuery(user?.id);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [shippingFormData, setShippingFormData] = useState({
    cityId: null as number | null,
    city: "",
    zoneId: null as number | null,
    zone: "",
    areaId: null as number | null,
    area: "",
    address: "",
    isPrimary: false,
  });

  const [usePoints, setUsePoints] = useState(false);
  const userPoints = singleUser?.data?.point || 0;

  const [addOrder, { isLoading: orderLoading, error }] = useAddOrderMutation(
    {}
  ) as any;
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const { data: branches } = useGetBranchesQuery({});

  const isBranchPickup = (method: any) => {
    return (
      method?.name?.toLowerCase().includes("branch pickup") || method?.id === 4
    );
  };

  const [paymentInstance, { isLoading: instanceLoading }] =
    usePaymentInstanceMutation();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  

  // Load cart data from localStorage only once
  useEffect(() => {
    const storedCart = localStorage.getItem("addToCart");
    if (storedCart) {
      setCartData(JSON.parse(storedCart));
    }
  }, []);

  // Set default shipping method when data loads
  useEffect(() => {
    if (shippingMethod?.data) {
      const defaultMethod = shippingMethod.data.find((m: any) => m.isDefault);
      if (defaultMethod) {
        setSelectedShippingMethod(defaultMethod);
      }
    }
  }, [shippingMethod]);

  const updateCart = (updatedCart: any[]) => {
    setCartData(updatedCart);
    localStorage.setItem("addToCart", JSON.stringify(updatedCart));
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
    removeFromCart(productId, colorId);
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
    clearCart();
    setCartData([]);
  };

  const calculateSubtotal = useCallback(() => {
    return cartData.reduce((total, item) => {
      const itemSubtotal =
        Number(item.originalPrice) * item.quantity +
        (item?.extraWarrantyPrice || 0) * item.quantity;
      return total + itemSubtotal;
    }, 0);
  }, [cartData]);

  const maxPointsDiscount = Math.floor(calculateSubtotal() * 0.5);
  const availablePointsDiscount = Math.floor(userPoints / 10);
  const pointsDiscount = usePoints
    ? Math.min(availablePointsDiscount, maxPointsDiscount)
    : 0;

  const [triggerVerifyCoupon, { isLoading: couponLoading }] =
    useLazyVerifyCouponQuery();

  const isDhakaAddress = (city: string | undefined) => {
    return city?.toLowerCase() === "dhaka";
  };

  // DEFAULT BRANCH PICKUP
  const defaultShippingMethod = shippingMethod?.data?.filter(
    (s) => s.name === "Branch pickup"
  );

  const getDefaultShippingMethod = (city: string | undefined) => {
    if (!shippingMethod?.data) return null;

    if (city === "Dhaka") {
      return shippingMethod.data.find(
        (d: any) => d?.name === "Shipping in Dhaka"
      );
    } else if (city) {
      return shippingMethod.data.find(
        (d: any) => d?.name === "Shipping out side Dhaka"
      );
    }
    return null;
  };

  useEffect(() => {
    const city = watch("shippingAddress.0.city");
    if (city && shippingMethod?.data) {
      const defaultMethod = getDefaultShippingMethod(city);
      if (defaultMethod) {
        setSelectedShippingMethod(defaultMethod);
      }
    }
  }, [watch("shippingAddress.0.city"), shippingMethod?.data]);

  useEffect(() => {
    if (
      shippingInfo?.data &&
      !watch("shippingAddress.0.id") &&
      shippingMethod?.data
    ) {
      const primaryAddress = shippingInfo.data.find((addr) => addr.isPrimary);

      if (primaryAddress) {
        setValue("shippingAddress.0.id", primaryAddress.id);
        setValue("shippingAddress.0.cityId", primaryAddress.cityId);
        setValue("shippingAddress.0.city", primaryAddress.city);
        setValue("shippingAddress.0.zoneId", primaryAddress.zoneId);
        setValue("shippingAddress.0.zone", primaryAddress.zone);
        setValue("shippingAddress.0.areaId", primaryAddress.areaId);
        setValue("shippingAddress.0.area", primaryAddress.area);
        setValue("shippingAddress.0.address", primaryAddress.address);

        // Update shipping method based on primary address
        const defaultMethod = getDefaultShippingMethod(primaryAddress.city);

        if (defaultMethod) {
          setSelectedShippingMethod(defaultMethod);
        }
      } else if (shippingMethod?.data) {
        // If no primary address, set the default shipping method
        const defaultMethod = shippingMethod.data.find((m: any) => m.isDefault);
        if (defaultMethod) {
          setSelectedShippingMethod(defaultMethod);
        }
      }
    }
  }, [shippingInfo?.data, shippingMethod?.data, setValue, watch]);

  // is full pay checking
  let defaultIsFullPay = false;

  for (const cart of cartData) {
    if (cart?.isFullPay === true) {
      defaultIsFullPay = true;
      break;
    }
  }

  const checkAllItemsFreeShipping = useCallback(() => {
    if (cartData.length === 0) return false;
    return cartData.every((item) => {
      if (typeof item.isShippedFree !== "undefined") return item.isShippedFree;
      if (item.brand?.isShippedFree) return true;
      if (item.category?.isShippedFree) return true;
      return false;
    });
  }, [cartData]);

  useEffect(() => {
    if (cartData[0]?.paymentMethod === "EMI") {
      setSelectedPaymentMethod(cartData[0].paymentMethod);
    }
  }, [cartData]);

  // const calculateGrandTotal = () => {
  //   const total = calculateTotal();
  //   const pointsDiscount = usePoints ? Math.floor(Number(userPoints)) / 10 : 0;
  //   return Math.max(0, total - pointsDiscount);
  // };

  const minAmountOfBookingPrice = banner?.data[0]?.minAmountOfBookingPrice || 0;
  const isDeliveryChargeAsAdvance =
    banner?.data[0]?.isDeliveryChargeAsAdvance || false;

  console.log(isDeliveryChargeAsAdvance);

  const calculateGatewayCharge = () => {
    const grandTotal = calculateSubtotal();
    if (description?.data?.[0]?.gatewayChargeType === "FIXED") {
      return description.data[0].gatewayCharge;
    } else if (description?.data?.[0]?.gatewayChargeType === "PERCENTAGE") {
      return (grandTotal * description.data[0].gatewayCharge) / 100;
    }
    return 0;
  };

  let pointDiscount = 0;
  if (usePoints && pointsDiscount > 0) {
    pointDiscount = pointsDiscount;
  }
  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    // const shippingCharge = selectedShippingMethod?.price || 0;

    let total = subtotal;

    if (emiChargeId) {
      const findCharge = bankEmis?.data.find((e) => e.id === emiChargeId);
      const productFreeEmiCharge = cartData[0]?.freeEmiCharge || 0;

      // Only add EMI charge if selected months exceed freeEmiCharge
      if (findCharge && findCharge.month > productFreeEmiCharge) {
        const emiCharge = (subtotal * findCharge.charge) / 100;
        total += emiCharge;
      }
    }

    return Math.round(total);
  }, [bankEmis?.data, calculateSubtotal, cartData, emiChargeId]);

  const emiCalculation = () => {
    const subtotal = calculateSubtotal();
    if (emiChargeId) {
      const findCharge = bankEmis?.data.find((e) => e.id === emiChargeId);
      const productFreeEmiCharge = cartData[0]?.freeEmiCharge || 0;

      // Only add EMI charge if selected months exceed freeEmiCharge
      if (findCharge && findCharge.month > productFreeEmiCharge) {
        const emiCharge = (subtotal * findCharge.charge) / 100;
        return emiCharge;
      }
    } else {
      return 0;
    }
  };

  const getShippingCharge = useCallback(() => {
    if (checkAllItemsFreeShipping()) return 0;
    return selectedShippingMethod?.price || 0;
  }, [checkAllItemsFreeShipping, selectedShippingMethod?.price]);

  const minBooking = banner?.data[0]?.minBooking || 0;
  const minBookingType = banner?.data[0]?.minBookingType || 0;
  const calculateTotalBookingPrice = useCallback(() => {
    const subTotal =
      calculateSubtotal() - Number(discountAmount ?? 0) - pointDiscount;

    if (selectedShippingMethod?.name === "Shipping in Dhaka") return 0;

    if (subTotal > minAmountOfBookingPrice) {
      if (minBookingType === "PERCENTAGE") {
        // Percentage calculation
        return Math.ceil((subTotal * minBooking) / 100);
      } else {
        // Default to FIXED amount
        return minBooking;
      }
    } else {
      const total = cartData.reduce((sum, item) => {
        return (
          sum + (item.bookingPrice > 0 ? item.bookingPrice * item.quantity : 0)
        );
      }, 0);
      return Math.ceil(total);
    }
  }, [
    calculateSubtotal,
    cartData,
    discountAmount,
    minAmountOfBookingPrice,
    minBooking,
    minBookingType,
    pointDiscount,
    selectedShippingMethod?.name,
  ]);

  useEffect(() => {
    if (
      selectedPaymentMethod === "COD" &&
      selectedShippingMethod?.name === "Shipping out side Dhaka"
    ) {
      const shippingCharge =
        calculateSubtotal() > minAmountOfBookingPrice &&
        isDeliveryChargeAsAdvance
          ? getShippingCharge()
          : 0;
      const total =
        calculateTotal() -
        calculateTotalBookingPrice() -
        shippingCharge -
        pointsDiscount -
        Math.ceil(discountAmount || 0);
      const conditionFee = total * (1 / 100);
      setConditionCharge(Number(conditionFee.toFixed(0)));
    } else {
      setConditionCharge(null);
    }
  }, [
    calculateSubtotal,
    calculateTotal,
    calculateTotalBookingPrice,
    discountAmount,
    getShippingCharge,
    isDeliveryChargeAsAdvance,
    minAmountOfBookingPrice,
    pointsDiscount,
    selectedPaymentMethod,
    selectedShippingMethod,
  ]);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast({
        title: "Use your Coupon Code",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await triggerVerifyCoupon({
        code: couponCode,
        totalAmount: calculateSubtotal(),
      }).unwrap();

      if (response?.success) {
        setDiscountAmount(Math.ceil(response?.data?.discount));
        setResponseCoupon(response?.data?.code);
        toast({
          title: `${response?.message}`,
          description: `Congratulations! You've received a discount of TK. ${response?.data?.discount.toLocaleString()} on your order.`,
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
        title: errorMessage,
        description:
          "Oops! The coupon code you entered is either incorrect or has expired. Please try another one.",
        variant: "destructive",
      });
      setDiscountAmount(null);
      setResponseCoupon("");
    }
  };

  // Shipping address handlers
  const handleShippingInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "address") {
      if (value.length < 10 && value.length > 0) {
        setAddressError("Address must be at least 10 characters");
      } else {
        setAddressError(null);
      }
    }

    setShippingFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCityChange = (cityId: number, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedZoneId(null);
    setShippingFormData((prev) => ({
      ...prev,
      cityId,
      city: cityName,
      zoneId: null,
      zone: "",
      areaId: null,
      area: "",
    }));
  };

  const handleZoneChange = (zoneId: number, zoneName: string) => {
    setSelectedZoneId(zoneId);
    setShippingFormData((prev) => ({
      ...prev,
      zoneId,
      zone: zoneName,
      areaId: null,
      area: "",
    }));
  };

  const handleAreaChange = (areaId: number, areaName: string) => {
    setShippingFormData((prev) => ({
      ...prev,
      areaId,
      area: areaName,
    }));
  };

  const handleCreateShipping = async () => {
    if (shippingFormData.address.length < 10) {
      setAddressError("Address must be at least 10 characters");
      return;
    }

    try {
      await createShippingInfo(shippingFormData).unwrap();
      toast({
        variant: "default",
        title: "Success!",
        description: "Shipping address created successfully",
      });
      setIsShippingModalOpen(false);
      refetch();
      setShippingFormData({
        cityId: null,
        city: "",
        zoneId: null,
        zone: "",
        areaId: null,
        area: "",
        address: "",
        isPrimary: false,
      });
      setAddressError(null);
    } catch (error: any) {
      console.error("Failed to save shipping address", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.data?.message || "Failed to save shipping address",
      });
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
      });
      return;
    }

    if (
      !watch("shippingAddress.0.cityId") ||
      !watch("shippingAddress.0.zoneId") ||
      !watch("shippingAddress.0.areaId") ||
      !watch("shippingAddress.0.address")
    ) {
      toast({
        title: "Shipping Address Required",
        description: "Please select a shipping address.",
        variant: "destructive",
      });
      return;
    }

    if (cartData.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty, add some items to proceed.",
      });
      return;
    }

    if (!selectedShippingMethod) {
      toast({
        title: "Shipping Method Required",
        description: "Please select a shipping method.",
      });
      return;
    }

    if (
      !data.shippingAddress?.[0]?.cityId ||
      !data.shippingAddress?.[0]?.zoneId ||
      !data.shippingAddress?.[0]?.areaId ||
      !data.shippingAddress?.[0]?.address
    ) {
      toast({
        title: "Shipping Address Required",
        description: "Please provide a complete shipping address.",
      });
      return;
    }

    const subtotal = calculateSubtotal();
    const shippingCharge = getShippingCharge();
    const conditionFee = conditionCharge || 0;

    const gatewayCharge =
      selectedPaymentMethod === "ONLINE" || selectedPaymentMethod === "EMI"
        ? Math.ceil(calculateGatewayCharge())
        : 0;
    const totalAmount = Math.ceil(
      subtotal +
        emiCalculation() +
        shippingCharge +
        conditionFee +
        gatewayCharge -
        (discountAmount ?? 0) -
        pointDiscount
    );

    let payableAmount;
    if (selectedPaymentMethod === "COD") {
      payableAmount =
        calculateTotalBookingPrice() +
        getShippingCharge() -
        (discountAmount ?? 0);
    } else if (selectedPaymentMethod === "EMI") {
      payableAmount =
        calculateTotal() +
        gatewayCharge -
        (discountAmount ?? 0) -
        pointDiscount;
    } else {
      payableAmount = totalAmount;
    }

    // Create a copy of data without district and thana in shippingAddress
    const cleanedData = {
      ...data,
      shippingAddress: data.shippingAddress?.map((address: any) => {
        const { district, thana, ...rest } = address;
        return rest;
      }),
    };

    const orderData = {
      ...cleanedData,
      orderType: cartData?.some((item) => item?.orderType === "PreOrder")
        ? "PreOrder"
        : "Order",
      shippingMethod: selectedShippingMethod.name,
      ...(isBranchPickup(selectedShippingMethod) &&
        selectedBranch && {
          branchId: Number(selectedBranch),
        }),
      paymentAmount:
        selectedPaymentMethod === "EMI"
          ? Math.ceil(
              calculateTotal() +
                gatewayCharge -
                (discountAmount ?? 0) -
                pointDiscount
            )
          : selectedPaymentMethod === "COD"
          ? Math.ceil(
              calculateTotalBookingPrice() +
                (Math.ceil(calculateSubtotal()) < minAmountOfBookingPrice
                  ? 0
                  : isDeliveryChargeAsAdvance
                  ? getShippingCharge()
                  : 0)
            )
          : payableAmount,

      //     paymentAmount: (selectedPaymentMethod === 'COD'
      // ? calculateTotalBookingPrice() + (calculateSubtotal() <= 4999 ? 0 : getShippingCharge())
      // : payableAmount),
      // paymentAmount: ((selectedPaymentMethod === 'COD' && calculateSubtotal() <= 4999) ? payableAmount - getShippingCharge() : payableAmount),
      totalAmount: totalAmount,
      couponDiscount: discountAmount || 0,
      userId: parseInt(user?.id),
      gatewayCharge: description.data[0].gatewayCharge,
      gatewayChargeAmount: gatewayCharge,
      gatewayChargeType: description?.data?.[0]?.gatewayChargeType || null,
      ...(usePoints && {
        totalPoint: pointsDiscount * 10,
        totalPointDiscount: pointsDiscount,
      }),
      shippingCharge: shippingCharge,
      paymentMethod: selectedPaymentMethod,
      orderItems: cartData.map((item) => {
        const itemData = {
          productId: item.id,
          productColorId: item.productColorId || item.colorId,
          productVariationId: item.variationId,
          ...(item?.giftId && { giftId: item.giftId }),
          quantity: item.quantity,
          price: Number(item.originalPrice),
          subTotal:
            Number(item.originalPrice) * item.quantity +
            (item?.extraWarrantyPrice || 0) * item.quantity,
        };

        if (item?.extraWarrantyId && item.extraWarrantyId > 0) {
          //@ts-ignore
          itemData.extraWarrantyId = item.extraWarrantyId;
        }
        //@ts-ignore
        return removeFalsyValuesProperties(itemData, ["extraWarrantyId"]);
      }),
    };

    if (responseCoupon) orderData.coupon = responseCoupon;
    if (conditionCharge !== null && !isNaN(conditionCharge))
      orderData.conditionFee = conditionCharge;

    if (selectedPaymentMethod === "EMI") {
      if (bankId !== null) orderData.bankId = bankId;
      if (emiChargeId !== null) orderData.emiChargeId = emiChargeId;
    }

    if (orderData.shippingAddress?.[0]?.id) {
      delete orderData.shippingAddress[0].id;
    }

    const finalData = removeFalsyValuesProperties(orderData, [
      "note",
      "coupon",
      "shippingCharge",
      "bankId",
      "emiChargeId",
      "conditionFee",
      "branchId",
      "bookingPrice",
      "customerNote",
    ]);

    try {
      const result = await addOrder(finalData);

      if (result?.data?.data && result?.data?.success) {
        // if (selectedPaymentMethod === "EMI") {
        //   toast({
        //     title: "Order Placed Successfully",
        //     description: "Your EMI order has been successfully placed.",
        //   });
        //   clearCartHandler();
        //   navigate("/my-account");
        //   return;
        // }

        const orderId = result.data.data.id;

        const paymentAmount = result?.data?.data?.paymentAmountRequest;

        if (
          ["ONLINE", "COD", "OP", "EMI", "SP"].includes(
            selectedPaymentMethod
          ) &&
          paymentAmount > 0
        ) {
          try {
            const paymentResponse = await paymentInstance({
              id: orderId,
            }).unwrap();
            if (paymentResponse?.success) {
              window.location.href = paymentResponse.data.url;
            } else {
              toast({
                title: "Payment Initialization Failed",
                description: "There was an issue processing your payment.",
              });
            }
          } catch (paymentError) {
            console.error("Payment instance error:", paymentError);
            toast({
              title: "Payment Error",
              description:
                "Failed to initiate online payment. Please try again.",
            });
          }
        } else {
          toast({
            title: "Order Placed Successfully",
            description: toastMessageGenerator("add", "order"),
          });
          clearCartHandler();
          navigate({
            pathname: "/my-account",
            search: "?type=orders",
          });
          return;
        }

        toast({
          title: "Order Placed Successfully",
          description: toastMessageGenerator("add", "order"),
        });
        clearCartHandler();
      } else {
        toast({
          title: "Order Placement Failed",
          description: "Please try again later.",
        });
      }
    } catch (error: any) {
      console.error("Error adding order:", error);
      toast({
        title: "Order Placement Failed",
        description: `${
          error?.data?.message ||
          "An unexpected error occurred. Please try again later."
        }`,
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto m-3 mt- mb-10">
      <div className="max-w-fit mx-auto mb-3">
        <CheckoutNotice selectedPaymentMethod={selectedPaymentMethod} />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        {/* Shipping Address */}
        <div className="border rounded-lg shadow-md p-5 bg-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-primary mb-3">
              🚚 Shipping Address
            </h2>

            {shippingInfo?.data?.length < 3 ? (
              <button
                type="button"
                className="bg-primary rounded-md text-white text-sm lg:text-base px-2 py-1.5"
                onClick={() => setIsShippingModalOpen(true)}
              >
                Add Shipping
              </button>
            ) : (
              ""
            )}
          </div>

          <div className="space-y-3 mb-4">
            <CheckOutAddress
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
            {shippingInfo?.data?.map((address: any) => (
              <div
                key={address.id}
                className={`border p-3 relative rounded-md cursor-pointer ${
                  watch("shippingAddress.0.id") === address.id ||
                  (address.isPrimary && !watch("shippingAddress.0.id"))
                    ? "border-primary bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  setValue("shippingAddress.0.id", address.id);
                  setValue("shippingAddress.0.cityId", address.cityId);
                  setValue("shippingAddress.0.city", address.city);
                  setValue("shippingAddress.0.zoneId", address.zoneId);
                  setValue("shippingAddress.0.zone", address.zone);
                  setValue("shippingAddress.0.areaId", address.areaId);
                  setValue("shippingAddress.0.area", address.area);
                  setValue("shippingAddress.0.address", address.address);

                  // Update shipping method based on selected address
                  const defaultMethod = getDefaultShippingMethod(address.city);
                  if (defaultMethod) {
                    setSelectedShippingMethod(defaultMethod);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {watch("shippingAddress.0.id") === address.id ||
                    (address.isPrimary && !watch("shippingAddress.0.id")) ? (
                      <IoMdRadioButtonOn className="text-primary" size={20} />
                    ) : (
                      <IoMdRadioButtonOff className="text-gray-400" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {address.city}, {address.zone}, {address.area}
                    </p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    {address.isPrimary && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute top-0 lg:top-2 right-2">
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger
                      asChild
                      onMouseEnter={() => setActionItem(address)}
                    >
                      <Edit className="text-primary w-4 lg:w-6" />
                    </DialogTrigger>
                    <DialogContent className="">
                      <EditShippingAddress
                        actionItem={actionItem}
                        setIsEditModalOpen={setIsModalOpen}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-primary my-2">
            🚛 Shipping Method
          </h2>

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
                  .filter((m) => m.isActive === true)
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
                                errors?.shippingAddress?.[0]?.branchId?.message
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
                {defaultShippingMethod
                  ?.filter((m) => m.isActive === true)
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
                                errors?.shippingAddress?.[0]?.branchId?.message
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

        {/* Payment Method */}
        <div className="border rounded-lg shadow-md p-5 bg-white">
          <h2 className="text-lg font-semibold text-primary mb-3">
            💳 Payment Method
          </h2>

          {[
            ...(!description?.data[0]?.isOnlinePayment
              ? [
                  {
                    id: "ONLINE",
                    label: "Online Payments",
                    icon: ssl,
                  },
                ]
              : []),

            // Only show EMI option if any product in cart has isEmi: true
            ...(!description?.data[0]?.isEmiPayment &&
            calculateSubtotal() >= minAmountOfBookingPrice
              ? [
                  {
                    id: "EMI",
                    label: "Payment in EMI",
                    icon: (
                      <RiMastercardFill className="text-primary" size={22} />
                    ),
                  },
                ]
              : []),
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
              <InputWrapper label="" labelFor="bankId" error={""}>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium">Select Bank</label>
                  <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
                </div>
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
                  <InputWrapper label="" labelFor="bankId" error={""}>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-sm font-medium">
                        Select EMI Plan
                      </label>
                      <FaStarOfLife className="h-2 w-2 text-muted-foreground text-red-500" />
                    </div>
                    <select
                      className="border-2 rounded-md px-2 py-2"
                      name="emi"
                      id="emi"
                      onChange={(e) => {
                        const selectedChargeId = Number(e.target.value);
                        setEmiChargeId(selectedChargeId);
                      }}
                    >
                      <option value="">Select an emi plan</option>
                      {bankEmis.data
                        .filter((emi) => emi.bankId === bankId)
                        .map((emi: any) => (
                          <option key={emi.id} value={emi.id}>
                            {emi.month} Months - Service Charge {emi.charge}%
                          </option>
                        ))}
                    </select>
                  </InputWrapper>
                </div>
              )}
            </div>
          )}
          {[
            ...(!defaultIsFullPay
              ? [
                  {
                    id: "COD",
                    label: "Cash on Delivery",
                    icon: (
                      <CiDeliveryTruck className="text-primary" size={22} />
                    ),
                  },
                ]
              : []),
          ].map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between border p-3 mt-1 rounded-md cursor-pointer mb-2 ${
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

          <div className="mt-5">
            <label className="inline-block pb-2">Note</label>
            <TextArea
              onChange={(e) => setValue("customerNote", e.target.value)}
              currentValue={watch("customerNote") || ""}
              placeHolder={"Write your note here..."}
              className="p-2"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg shadow-md p-5 bg-white ">
          <h2 className="text-lg font-semibold text-primary mb-3">
            🛒 Order Summary
          </h2>
          <div className="border p-3 rounded-md bg-white  ">
            {cartData?.length > 0 && (
              <div className="flex flex-col gap-3">
                {cartData.map((item: any) => (
                  <div
                    key={item.id + "-" + item.colorId}
                    className=" lg:flex items-center justify-between relative border px-3 py-6 rounded-md shadow-sm"
                  >
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
                    <Link
                      to={`/products/${item?.productLink}`}
                      className="flex items-center"
                    >
                      <div className="md:flex md:justify-center lg:flex-none sm:mt-0 md:mt-3 lg:mt-0  ">
                        {/* Product Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded-md border "
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 px-3">
                        <p className="font-semibold text-gray-700 text-xs pt-0.5 md:text-[14px]">
                          {item.title}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {item.originalPrice.toLocaleString()} ৳
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
                      </div>
                    </Link>

                    {/* Action Buttons (Edit & Delete) */}
                    <div className="flex items-center gap-2 lg:gap-10 xl:gap-2 justify-between mt-2 lg:mt-4 xl:mt-0">
                      <Link to={"/cart"}>
                        <FiEdit className="text-gray-500 cursor-pointer " />
                      </Link>

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
            <div className="flex justify-between text-lg font-semibold">
              <span className="font-bold">Item Price:</span>
              <span className="font-bold">
                TK. {calculateSubtotal().toLocaleString()}
              </span>
            </div>

            {/* Points UI */}

            {(selectedPaymentMethod === "ONLINE" ||
              selectedPaymentMethod === "EMI") &&
            description?.data?.[0]?.gatewayCharge ? (
              <div className="flex justify-between text-sm font-bold">
                <span>
                  Gateway Charge (
                  {description.data[0].gatewayChargeType === "FIXED"
                    ? "Fixed"
                    : `${description.data[0].gatewayCharge}%`}
                  ):
                </span>
                <span>
                  TK. {Math.ceil(calculateGatewayCharge()).toLocaleString()}
                </span>
              </div>
            ) : (
              ""
            )}
            {selectedPaymentMethod === "EMI" && bankId && emiChargeId && (
              <div className="flex justify-between text-sm font-bold text-primary">
                <span>EMI Service Charge:</span>
                <span>
                  {(() => {
                    const selectedEmi = bankEmis?.data.find(
                      (e) => e.id === emiChargeId
                    );
                    const productFreeEmiCharge =
                      cartData[0]?.freeEmiCharge || 0;

                    // If selected months is less than or equal to freeEmiCharge, show FREE
                    if (selectedEmi?.month <= productFreeEmiCharge) {
                      return "FREE";
                    }

                    // Otherwise calculate and show the charge
                    const charge = Math.round(
                      (calculateSubtotal() * (selectedEmi?.charge || 0)) / 100
                    );
                    return `TK. ${charge.toLocaleString()}`;
                  })()}
                </span>
              </div>
            )}
            {/* Grand Total - Always show full amount */}
            <div className="flex justify-between text-lg font-bold">
              <span className="">Sub Total:</span>
              <span className="">
                TK.{" "}
                {Math.ceil(
                  Number(calculateTotal()) +
                    (selectedPaymentMethod === "ONLINE" ||
                    selectedPaymentMethod === "EMI"
                      ? Number(calculateGatewayCharge())
                      : 0)
                ).toLocaleString()}
              </span>
            </div>

            {/* Points Discount */}
            {usePoints && (
              <div className="flex justify-between text-lg font-semibold">
                <span className="font-bold">Points Discount:</span>
                <span className="font-bold  text-red-600 flex gap-2 items-center">
                  {availablePointsDiscount > maxPointsDiscount && (
                    <span className="text-xs text-gray-500 ml-1">
                      (Max 50% of product price)
                    </span>
                  )}
                  -TK. {pointsDiscount.toLocaleString()}
                </span>
              </div>
            )}
            {discountAmount && discountAmount > 0 ? (
              <div className="flex justify-between text-sm font-bold pb-2">
                <div className="flex items-center gap-1">
                  <span>Coupon Discount </span>
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
                  - TK. {Math.ceil(discountAmount)}
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
              <span className="">Total:</span>
              <span className="">
                TK.{" "}
                {Math.ceil(
                  calculateTotal() +
                    (selectedPaymentMethod === "ONLINE" ||
                    selectedPaymentMethod === "EMI"
                      ? Number(calculateGatewayCharge())
                      : 0) -
                    Number(discountAmount ?? 0) -
                    pointDiscount
                ).toLocaleString()}
              </span>
            </div>

            {(selectedPaymentMethod === "COD" &&
              calculateTotalBookingPrice() > 0) ||
            (selectedPaymentMethod === "COD" && isDeliveryChargeAsAdvance) ? (
              <div className="flex justify-between text-lg font-semibold">
                <span>Advance Payment:</span>
                <span className="text-green-700">
                  TK.{" "}
                  {(
                    calculateTotalBookingPrice() +
                    (calculateSubtotal() < minAmountOfBookingPrice
                      ? 0
                      : isDeliveryChargeAsAdvance
                      ? getShippingCharge()
                      : 0)
                  ).toLocaleString()}
                </span>
              </div>
            ) : (
              ""
            )}

            {/* Shipping Charges */}
            <div className="flex justify-between text-sm font-bold">
              <p>
                Delivery Charge{" "}
                <span className="text-[10px] lg:text-xs text-gray-400">
                  ({selectedShippingMethod?.name || "Standard"})
                </span>
                :
              </p>
              <span>
                {checkAllItemsFreeShipping()
                  ? "FREE"
                  : `TK. ${getShippingCharge().toLocaleString()}`}
              </span>
            </div>
            {selectedPaymentMethod === "COD" && (
              <>
                {/* Condition Charge */}
                {conditionCharge && conditionCharge > 0 ? (
                  <div className="flex justify-between text-sm text-red-600 font-bold">
                    <span className="text-red-600">Condition Charge (1%):</span>
                    <span>TK. {conditionCharge.toLocaleString()}</span>
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
            {/* COD Payment Summary */}
            {selectedPaymentMethod === "COD" && (
              <>
                {/* {calculateTotalBookingPrice() > 0 && (
                  <div className="flex justify-between text-sm font-bold text-gray-600">
                    <span>Advance Payment (Booking Price):</span>
                    <span>
                      TK. {calculateTotalBookingPrice().toLocaleString()}
                    </span>
                  </div>
                )} */}

                <div className="flex justify-between text-red-600 text-base font-bold pb-3">
                  <span>Payable on Delivery:</span>
                  <span className="">
                    {(() => {
                      const shippingCharge =
                        calculateSubtotal() > minAmountOfBookingPrice &&
                        isDeliveryChargeAsAdvance
                          ? getShippingCharge()
                          : 0;
                      const total =
                        calculateTotal() +
                        (conditionCharge ?? 0) -
                        calculateTotalBookingPrice() -
                        (shippingCharge > 0
                          ? shippingCharge
                          : -getShippingCharge()) -
                        pointsDiscount -
                        Math.ceil(discountAmount || 0);
                      return `TK. ${total.toLocaleString()}`;
                    })()}
                  </span>
                </div>
              </>
            )}
          </div>
          {userPoints > 0 &&
            (selectedPaymentMethod !== "EMI" ||
              (selectedPaymentMethod === "EMI" &&
                !(
                  bankId &&
                  emiChargeId &&
                  bankEmis?.data.find((e) => e.id === emiChargeId)?.month <=
                    (cartData[0]?.freeEmiCharge || 0)
                ))) && (
              <label className="flex items-center space-x-2 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={(e) => {
                    setUsePoints(e.target.checked);
                    if (
                      e.target.checked &&
                      availablePointsDiscount > maxPointsDiscount
                    ) {
                      toast({
                        title: "Points Usage Limited",
                        description: `You can only use points worth up to 50% of product price (TK. ${maxPointsDiscount.toLocaleString()})`,
                      });
                    }
                  }}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <span className="text-gray-700">
                  <span>Use my points ({userPoints} points)</span>
                </span>
              </label>
            )}

          <div className="my-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4"
            />
            <p className="text-sm text-gray-600">
              I agree with the{" "}
              <span className="text-primary cursor-pointer">
                <Dialog>
                  <DialogTrigger asChild>
                    <span>Terms & Conditions, </span>
                  </DialogTrigger>
                  <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto">
                    <TermsAndConditions slug={termsAndConditionsSlug?.slug} />
                  </DialogContent>
                </Dialog>
              </span>
              <span className="text-primary cursor-pointer">
                <Dialog>
                  <DialogTrigger asChild>
                    <span>Privacy Policy</span>
                  </DialogTrigger>
                  <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto">
                    <PrivacyPolicy slug={privacyPolicySlug?.slug} />
                  </DialogContent>
                </Dialog>
              </span>
              , and{" "}
              <span className="text-primary cursor-pointer">
                <Dialog>
                  <DialogTrigger asChild>
                    <span>Return Policy</span>
                  </DialogTrigger>
                  <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto">
                    <ReturnPolicy slug={returnPolicySlug?.slug} />
                  </DialogContent>
                </Dialog>
              </span>
              .
            </p>
          </div>

          <p className="text-red-600">
            {error?.data?.errorMessage?.body?.[0]?.message &&
              formatErrorMessage(error.data.errorMessage.body[0].message)}
          </p>

          <Button
            type="submit"
            disabled={
              !selectedPaymentMethod ||
              !selectedShippingMethod ||
              (selectedPaymentMethod === "EMI" && !bankId) ||
              !agree ||
              orderLoading
            }
            className="w-full bg-primary text-white py-1.5 lg:py-3 mt-4 text-sm lg:text-lg font-semibold"
          >
            {orderLoading || (instanceLoading && <ButtonLoader />)}
            PLACE ORDER
          </Button>
        </div>
      </form>

      <Dialog open={isShippingModalOpen} onOpenChange={setIsShippingModalOpen}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setIsShippingModalOpen(false)}
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <div>
              <p>City {requiredStar}</p>
              <SearchableSelect
                label="City"
                options={cities.map((city) => ({
                  id: city.city_id,
                  name: city.city_name,
                }))}
                value={shippingFormData.cityId?.toString() || ""}
                onValueChange={(value) => {
                  const city = cities.find(
                    (c) => c.city_id.toString() === value
                  );
                  if (city) {
                    handleCityChange(city.city_id, city.city_name);
                  }
                }}
                placeholder="Select City"
                labelKey="name"
                valueKey="id"
              />
            </div>

            <div>
              <p>Zone {requiredStar}</p>
              <SearchableSelect
                label="Zone"
                options={zoneList.map((zone) => ({
                  id: zone.zone_id,
                  name: zone.zone_name,
                }))}
                value={shippingFormData.zoneId?.toString() || ""}
                onValueChange={(value) => {
                  const zone = zoneList.find(
                    (z) => z.zone_id.toString() === value
                  );
                  if (zone) {
                    handleZoneChange(zone.zone_id, zone.zone_name);
                  }
                }}
                placeholder="Select Zone"
                disabled={!selectedCityId}
                labelKey="name"
                valueKey="id"
              />
            </div>

            <div>
              <p>Area {requiredStar}</p>
              <SearchableSelect
                label="Area"
                options={areaList.map((area) => ({
                  id: area.area_id,
                  name: area.area_name,
                }))}
                value={shippingFormData.areaId?.toString() || ""}
                onValueChange={(value) => {
                  const area = areaList.find(
                    (a) => a.area_id.toString() === value
                  );
                  if (area) {
                    handleAreaChange(area.area_id, area.area_name);
                  }
                }}
                placeholder="Select Area"
                disabled={!selectedZoneId}
                labelKey="name"
                valueKey="id"
              />
            </div>

            <div>
              <p>Address {requiredStar}</p>
              <textarea
                className="w-full border rounded-md p-2"
                name="address"
                value={shippingFormData.address}
                onChange={handleShippingInputChange}
                rows={3}
              />
              {addressError && (
                <p className="text-red-500 text-sm">{addressError}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrimary"
                name="isPrimary"
                checked={shippingFormData.isPrimary}
                onChange={handleShippingInputChange}
                className="mr-2"
              />
              <label htmlFor="isPrimary" className="text-sm text-gray-700">
                Set as primary address
              </label>
            </div>
          </div>

          <Button
            onClick={handleCreateShipping}
            className="bg-primary text-white px-4 py-2 rounded-md mt-4"
            disabled={
              !shippingFormData.cityId ||
              !shippingFormData.zoneId ||
              !shippingFormData.areaId ||
              !shippingFormData.address ||
              shippingFormData.address.length < 10
            }
          >
            Save Address
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutNew;
