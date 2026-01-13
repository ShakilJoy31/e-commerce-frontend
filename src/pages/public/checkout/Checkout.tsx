import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useAddOrderMutation } from "@/components/store/api/order/orderApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
// import { yupResolver } from "@hookform/resolvers/yup";

import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";

import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/context/CartContext";

const Checkout = () => {
  const { clearCart } = useCart();
  const [cartData, setCartData] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<number>(100);
  const navigate = useNavigate();
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const user = useSelector(selectUser);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    city: "",
    address: "",
    zipCode: "",
    district: "",
    phone: "",
    email: "",
  });

  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    city: "",
    address: "",
    zipCode: "",
    district: "",
    phone: "",
    email: "",
  });

  const [addOrder, { isLoading: addOrderLoading }] = useAddOrderMutation(
    {}
  ) as any;

  // Load cart data from localStorage only once
  useEffect(() => {
    const storedCart = localStorage.getItem("addToCart");
    if (storedCart) {
      setCartData(JSON.parse(storedCart));
    }
  }, []);
  
  // Function to update cart data and localStorage together
  const updateCart = (updatedCart: any[]) => {
    setCartData(updatedCart);
    localStorage.setItem("addToCart", JSON.stringify(updatedCart));
  };
  const clearCartHandler = () => {
    clearCart();

    setCartData([]);
  };

  // Handle quantity change
  const handleQuantityChange = (id: number, delta: number) => {
    const updatedCart = cartData?.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );
    updateCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cartData.reduce((total, item) => {
      const itemSubtotal =
        Number(item.originalPrice.replace(/,/g, "")) * item.quantity +
        (item?.ExtraWarranty[0]?.price || 0) * item.quantity;
      return total + itemSubtotal;
    }, 0);
  };

  // Calculate total (subtotal + shipping)
  const calculateTotal = () => calculateSubtotal() + selectedShipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: "billing" | "shipping"
  ) => {
    const { name, value } = e.target;

    if (type === "billing") {
      setBillingDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setShippingDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrder = async () => {
    // Combine the address information
    const billingAddress = [
      {
        firstName: billingDetails.firstName,
        lastName: billingDetails.lastName,
        address: billingDetails.address,
        city: billingDetails.city,
        zipCode: billingDetails.zipCode,
        district: billingDetails.district,
        phone: billingDetails.phone,
        email: billingDetails.email,
      },
    ];

    const shippingAddress = [
      {
        firstName: shipToDifferent
          ? shippingDetails.firstName
          : billingDetails.firstName,
        lastName: shipToDifferent
          ? shippingDetails.lastName
          : billingDetails.lastName,
        address: shipToDifferent
          ? shippingDetails.address
          : billingDetails.address,
        city: shipToDifferent ? shippingDetails.city : billingDetails.city,
        zipCode: shipToDifferent
          ? shippingDetails.zipCode
          : billingDetails.zipCode,
        district: shipToDifferent
          ? shippingDetails.district
          : billingDetails.district,
        phone: shipToDifferent ? shippingDetails.phone : billingDetails.phone,
        email: shipToDifferent ? shippingDetails.email : billingDetails.email,
      },
    ];

    console.log(cartData);

    const data = {
      userId: user?.id,
      totalAmount: calculateTotal(),
      orderItems: cartData.map((item) => ({
        productVariationId: item.variationId,
        productColorId: item.colorId,
        extraWarrantyId: item?.ExtraWarranty?.[0]?.id,
        productId: item.id,
        quantity: item.quantity,
        price: Number(item.originalPrice.replace(/,/g, "")),
        subTotal:
          Number(item.originalPrice.replace(/,/g, "")) * item.quantity +
          (item?.ExtraWarranty?.[0]?.price || 0) * item?.quantity,
      })),
      billingAddress,
      shippingAddress,
      paymentMethod: cartData[0]?.paymentMethod,
    };

    try {
      const result = await addOrder(data);

      if (result?.data?.data && result?.data?.success) {
        toast({
          title: "Order Placed Successfully",
          description: toastMessageGenerator("add", "order"),
        });
        clearCartHandler();
        navigate("/my-account");
      } else {
        toast({
          title: "Order Placement Failed",
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error adding order:", error);
      toast({
        title: "Order Placement Failed",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <div>
      <div className="bg-other_bg bg-cover py-16">
        <SectionWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center">CHECKOUT</h2>
          <h2 className="text-[14px] font-medium flex items-center">
            HOME{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Checkout
          </h2>
        </SectionWrapper>
      </div>
      <div className=" min-h-screen p-8">
        <SectionWrapper className=" grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Billing Details */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border">
            {/* Top Banner */}
            <div className="text-center mb-4 bg-purple-100 p-3 rounded text-sm">
              HAVE A COUPON?{" "}
              <span className="text-primary cursor-pointer hover:underline">
                CLICK HERE TO ENTER YOUR CODE
              </span>
            </div>

            {/* Billing Details */}
            <h2 className="text-lg font-semibold mb-4">BILLING DETAILS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: "First name",
                  name: "firstName",
                  placeholder: "First name",
                  required: true,
                },
                {
                  label: "Last name",
                  name: "lastName",
                  placeholder: "Last name",
                  required: true,
                },
              ].map((field, idx) => (
                <div key={idx} className="flex flex-col">
                  <label className="block text-sm mb-1">{field.label} *</label>
                  <input
                    type="text"
                    name={field.name}
                    className="w-full border p-2 rounded"
                    placeholder={field.placeholder}
                    value={
                      billingDetails[field.name as keyof typeof billingDetails]
                    }
                    onChange={(e) => handleInputChange(e, "billing")}
                    required={field.required}
                  />
                </div>
              ))}
              <div className="flex flex-col">
                <label className="block text-sm mb-1">Country / Region *</label>
                <input
                  type="text"
                  value="Bangladesh"
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm mb-1">Town/City *</label>
                <input
                  type="text"
                  name="city"
                  className="w-full border p-2 rounded"
                  placeholder="City"
                  value={billingDetails.city}
                  onChange={(e) => handleInputChange(e, "billing")}
                />
              </div>
              <div className="col-span-1 sm:col-span-2 flex flex-col">
                <label className="block text-sm mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  className="w-full border p-2 rounded"
                  placeholder="House number and street name"
                  value={billingDetails.address}
                  onChange={(e) => handleInputChange(e, "billing")}
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm mb-1">Postcode/ZIP *</label>
                <input
                  type="text"
                  name="zipCode"
                  className="w-full border p-2 rounded"
                  placeholder="Postcode"
                  value={billingDetails.zipCode}
                  onChange={(e) => handleInputChange(e, "billing")}
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm mb-1">District *</label>
                <Select
                  onValueChange={(value) =>
                    setBillingDetails((prev) => ({ ...prev, district: value }))
                  }
                >
                  <SelectTrigger className="w-full border p-2 rounded">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Dhaka", "Chittagong", "Khulna", "Rajshahi"].map(
                      (district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm mb-1">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  className="w-full border p-2 rounded"
                  placeholder="+880"
                  value={billingDetails.phone}
                  onChange={(e) => handleInputChange(e, "billing")}
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-sm mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="w-full border p-2 rounded"
                  placeholder="you@example.com"
                  value={billingDetails.email}
                  onChange={(e) => handleInputChange(e, "billing")}
                />
              </div>
            </div>

            {/* Ship to a Different Address */}
            <div className="mt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={() => setShipToDifferent(!shipToDifferent)}
                />
                <span className="text-sm font-semibold">
                  Ship to a different address?
                </span>
              </label>

              {shipToDifferent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      label: "First name",
                      name: "firstName",
                      placeholder: "First name",
                      required: true,
                    },
                    {
                      label: "Last name",
                      name: "lastName",
                      placeholder: "Last name",
                      required: true,
                    },
                  ].map((field, idx) => (
                    <div key={idx} className="flex flex-col">
                      <label className="block text-sm mb-1">
                        {field.label} *
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        className="w-full border p-2 rounded"
                        placeholder={field.placeholder}
                        value={
                          shippingDetails[
                            field.name as keyof typeof shippingDetails
                          ]
                        }
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required={field.required}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col">
                    <label className="block text-sm mb-1">
                      Country / Region *
                    </label>
                    <input
                      type="text"
                      value="Bangladesh"
                      disabled
                      className="w-full border p-2 rounded bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm mb-1">Town/City *</label>
                    <input
                      type="text"
                      name="city"
                      className="w-full border p-2 rounded"
                      placeholder="City"
                      value={shippingDetails.city}
                      onChange={(e) => handleInputChange(e, "shipping")}
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex flex-col">
                    <label className="block text-sm mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      className="w-full border p-2 rounded"
                      placeholder="House number and street name"
                      value={shippingDetails.address}
                      onChange={(e) => handleInputChange(e, "shipping")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm mb-1">Postcode/ZIP *</label>
                    <input
                      type="text"
                      name="zipCode"
                      className="w-full border p-2 rounded"
                      placeholder="Postcode"
                      value={shippingDetails.zipCode}
                      onChange={(e) => handleInputChange(e, "shipping")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm mb-1">District *</label>
                    <select
                      name="district"
                      className="w-full border p-2 rounded"
                      value={shippingDetails.district}
                      onChange={(e) => handleInputChange(e, "shipping")}
                    >
                      <option value="">Select district</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Rajshahi">Rajshahi</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm mb-1">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      className="w-full border p-2 rounded"
                      placeholder="+880"
                      value={shippingDetails.phone}
                      onChange={(e) => handleInputChange(e, "shipping")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full border p-2 rounded"
                      placeholder="you@example.com"
                      value={shippingDetails.email}
                      onChange={(e) => handleInputChange(e, "shipping")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="border rounded-lg">
            <h2 className="text-lg font-bold my-4 px-4 text-center md:text-left">
              YOUR ORDER
            </h2>
            <div className="bg-[#F7F0FF]/50 p-4 space-y-4">
              {/* Product Names and Subtotals */}
              <div className="space-y-2">
                {cartData.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm font-semibold"
                  >
                    <span>{item.title}</span>
                    <div className="flex items-center flex-col gap-1">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="border px-1 rounded hover:bg-gray-200"
                        >
                          <Minus className="w-4" />
                        </button>
                        <span className="mx-1">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="border px-1 rounded hover:bg-gray-200"
                        >
                          <Plus className="w-4" />
                        </button>
                      </div>
                      <span>
                        {Number(item.originalPrice.replace(/,/g, "")) *
                          item.quantity +
                          (item?.ExtraWarranty[0]?.price || 0) *
                            item?.quantity}{" "}
                        ৳
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              {/* Shipping Options */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Shipping</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="100"
                      checked={selectedShipping === 100}
                      onChange={() => setSelectedShipping(100)}
                      className="mr-2"
                    />
                    Regular Home Delivery Inside Dhaka (Smartphone) - 100 ৳
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="200"
                      checked={selectedShipping === 200}
                      onChange={() => setSelectedShipping(200)}
                      className="mr-2"
                    />
                    Express Delivery (Before 12:30 PM) - 200 ৳
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="60"
                      checked={selectedShipping === 60}
                      onChange={() => setSelectedShipping(60)}
                      className="mr-2"
                    />
                    Regular Home Delivery Inside Dhaka (Gadget) - 60 ৳
                  </label>
                </div>
              </div>
              <hr />
              {/* Subtotal */}
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{calculateSubtotal().toLocaleString()} ৳</p>
              </div>
              {/* Total */}
              <div className="flex justify-between font-semibold">
                <p>Total</p>
                <p>{calculateTotal().toLocaleString()} ৳</p>
              </div>
              <hr />
              <button
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded hover:bg-indigo-700"
                onClick={(e) => {
                  e.preventDefault();
                  if (!user?.email) {
                    navigate("/login");
                  } else {
                    handleAddOrder();
                  }
                }}
                disabled={cartData.length === 0 || addOrderLoading}
              >
                {addOrderLoading && <ButtonLoader />} Complete Order
              </button>
            </div>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default Checkout;
