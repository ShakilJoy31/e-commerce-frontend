import { useGetOrderByOrderIdQuery } from "@/components/store/api/order/orderApi";
import { useState } from "react";

const Tracking = () => {
  const [orderId, setOrderId] = useState<string>("");

  const {
    data: orderDetails,
    isLoading,
    isError,
  } = useGetOrderByOrderIdQuery(orderId, {
    skip: orderId.length < 8,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const orderProgress = orderDetails?.data?.orderStatus;

  return (
    <div className="flex flex-col py-5 items-center justify-center min-h-screen bg-gray-50">
      {/* Track Order Section */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center mb-8">
        <h2 className="text-2xl font-semibold text-primary">
          Tracking Order
        </h2>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter your order ID"
          className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Tracking Order"}
        </button>
      </div>

      {/* Order Details Section */}
      {isLoading && <p className="text-xl font-semibold">Loading...</p>}
      {isError && (
        <p className="text-xl font-semibold text-red-500">
          Error fetching order details
        </p>
      )}

      {orderDetails && !isLoading && !isError && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl text-left">
          <div className="flex justify-between py-3">
            <h3 className="text-xl font-semibold mb-4">
              Order #{orderDetails?.data?.orderId}
            </h3>
            <div className="space-x-3">
              <span>
                {orderDetails?.data?.createdAt
                  ? formatDate(orderDetails.data.createdAt)
                  : "N/A"}
              </span>
              <strong className="text-sm">
                {" "}
                <button className="rounded-xl bg-primary px-5 py-1.5 text-white">
                  {orderProgress}
                </button>
              </strong>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          <h3 className="text-xl font-semibold text-primary my-4">Timeline</h3>

          {/* Order Status Progress Bar */}
          <div className="flex justify-center items-center w-full my-8">
            <div className="flex items-center w-full justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-5 right-5 h-1 bg-gray-300"></div>

              {["PENDING", "PROCESSING", "CONFIRMED", "HOLD", "CANCELED", "SHIPPED", "DELIVERED", "COMPLETED"].map(
                (step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center relative z-10"
                  >
                    {/* Step Circle */}
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                        orderDetails?.data?.orderStatus === step
                          ? "bg-blue-500 text-white": orderDetails?.data?.orderStatus === "PROCESSING" && index <= 1 
                          ? "bg-blue-500 text-white": orderDetails?.data?.orderStatus === "CONFIRMED" && index <= 2 
                          ? "bg-blue-500 text-white" : orderDetails?.data?.orderStatus === "HOLD" && index <= 3
                          ? "bg-blue-500 text-white" : orderDetails?.data?.orderStatus === "CANCELED" && index <= 4
                          ? "bg-blue-500 text-white" : orderDetails?.data?.orderStatus === "SHIPPED" && index <= 5
                          ? "bg-blue-500 text-white" : orderDetails?.data?.orderStatus === "DELIVERED" && index <= 6
                          ? "bg-blue-500 text-white" : orderDetails?.data?.orderStatus === "COMPLETED" && index <= 7
                          ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="mt-2 text-sm font-medium">{step}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Order Status History */}
          <div className="flex flex-col gap-2 text-sm mb-4">
            <ul className="space-y-3">
              {orderDetails?.data?.OrderTracking?.map((tracking, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="">
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {formatDate(tracking.createdAt)}
                      </span>
                      <span className="font-medium border-l-2 border-0 border-black ml-1 pl-1">{tracking.orderStatus}</span>
                       {tracking?.note && (
                        <span className="font-medium border-l-2 border-0 border-black ml-1 pl-1">{tracking.note}</span>
                       )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <h4 className="text-lg font-semibold mb-4 mt-2 text-primary">
            Products Summary
          </h4>
          <div className="flex justify-between">
            {/* Products */}
            {orderDetails?.data?.OrderItem?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <div>
                  <img
                    src={item?.product?.ProductImage[0]?.imageUrl}
                    alt={item.product.productName}
                    className="w-24 h-28 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <div className="font-bold text-xl">
                    {item?.product?.productName}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold">Sold by:</span>{" "}
                    <span className="text-gray-700">Philips Official</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold">Color:</span>{" "}
                    <span className="text-gray-700 ">
                      {item?.productColor?.color?.color}{" "}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Shipping Charge and Total Price */}
            <div className="gap-10 text-base mb-4 text-end space-y-5 mt-10">
              <div className="gap-2">
                <span className="font-semibold text-primary">
                  ৳{orderDetails?.data?.totalAmount}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm justify-end">
                <strong>Qty</strong>
                <span className="font-semibold">
                  {orderDetails?.data?.OrderItem.length}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-center">
                <strong>Shipping Charge:</strong>
                <span className="font-semibold">
                  ৳{orderDetails?.data?.shippingCharge}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 justify-end">
                <strong>Subtotal:</strong>
                <span className="font-semibold">
                  ৳
                  {orderDetails?.data?.shippingCharge +
                    orderDetails?.data?.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
