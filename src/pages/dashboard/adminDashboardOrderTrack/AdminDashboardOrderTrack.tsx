import { useGetSingleOrderQuery } from "@/components/store/api/order/orderApi";
import { Button } from "@/components/ui/button";
import Table from "@/components/ui/table";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChangeStatus from "../order/ChangeStatus";
import { Link } from "react-router-dom";

export default function AdminDashboardOrderTrack() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch the single order dynamically
  const { data: order, isLoading, isError } = useGetSingleOrderQuery(orderId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !order) {
    return <div>Error fetching order data.</div>;
  }

  const orderData = order?.data;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-600 mb-6 hover:text-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      {/* Order Tracking Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">
        Order Tracking
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 mb-6">
            Tracking information for this order.
          </h3>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setModalOpen(true)}
              variant="default"
              className="w-full flex justify-start p-2"
              size="xs"
            >
              Change Status
            </Button>
            {orderData.orderStatus === "PENDING" && (
              <>
                <Link to={`/kry-admin-portal/edit-order/${orderData?.id}`}>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start p-2"
                    size="xs"
                  >
                    Edit Order
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center w-full my-8">
          <div className="flex items-center w-full justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-1 bg-gray-300"></div>

            {[
              "PENDING",
              "CONFIRMED",
              "CANCELLED",
              "PROCESSING",
              "HOLD",
              "SHIPPED",
              "IN_DELIVERY",
              "DELIVERED",
              "COMPLETED",
            ].map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center relative z-10"
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    orderData?.orderStatus === step
                      ? step === "SHIPPED"
                        ? "bg-purple-500 text-white"
                        : "bg-yellow-500 text-white"
                      : orderData?.orderStatus === "CONFIRMED" && index <= 1
                      ? "bg-blue-500 text-white"
                      : orderData?.orderStatus === "PROCESSING" && index <= 3
                      ? "bg-blue-500 text-white"
                      : (orderData?.orderStatus === "SHIPPED" && index <= 5) ||
                        (orderData?.orderStatus === "IN_DELIVERY" &&
                          index <= 6) ||
                        (orderData?.orderStatus === "DELIVERED" &&
                          index <= 7) ||
                        (orderData?.orderStatus === "COMPLETED" && index <= 8)
                      ? "bg-green-500 text-white" // Completed steps (including up to SHIPPED)
                      : orderData?.orderStatus === "CANCELLED" && index <= 2
                      ? "bg-red-500 text-white"
                      : orderData?.orderStatus === "HOLD" && index <= 4
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-700" // Inactive steps
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-sm font-medium">
                  {step === "IN_DELIVERY" ? "IN DELIVERY" : step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="container space-y-4 p-4">
          {/* Order Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-500 mb-4 underline">
                Order Summary
              </h3>

              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">
                  Order ID
                </span>
                <span className="text-sm text-gray-600">
                  {orderData?.orderId}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">
                  Order Placed
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(orderData?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">Total</span>
                <span className="text-sm font-semibold text-gray-600">
                  {orderData?.totalAmount?.toLocaleString()} ৳
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">
                  Payment Method
                </span>
                <span className="text-sm text-gray-600 uppercase">
                  {orderData?.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">
                  Payment Status
                </span>
                <span className="text-sm text-gray-600">
                  {orderData?.paymentStatus ? "Paid" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">
                  Shipping Charge
                </span>
                <span className="text-sm font-semibold text-gray-600">
                  {orderData?.shippingCharge?.toLocaleString()} ৳
                </span>
              </div>
            </div>

            {/* Shipping Information Section */}
            <div className="space-y-3 rounded-lg pl-3">
              <h3 className="text-lg font-bold text-gray-500 mb-4 underline">
                Shipping Information
              </h3>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">Name</span>
                <span className="text-sm text-gray-600">
                  {orderData?.OrderShippingInfo[0]?.name}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">
                  Address
                </span>
                <span className="text-sm text-gray-600">
                  {orderData?.OrderShippingInfo[0]?.address}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">City</span>
                <span className="text-sm text-gray-600">
                  {orderData?.OrderShippingInfo[0]?.area},{" "}
                  {orderData?.OrderShippingInfo[0]?.zone},{" "}
                  {orderData?.OrderShippingInfo[0]?.city}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="text-sm text-gray-600">
                  {orderData?.OrderShippingInfo[0]?.phone}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="text-sm text-gray-600">
                  {orderData?.OrderShippingInfo[0]?.email}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium text-gray-700">Note</span>
                <span className="text-sm text-gray-600">
                  {orderData?.customerNote || ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-500 mb-4">Order Summary</h3>

        <Table
          headers={[
            "#",
            "Image",
            "Product",
            "Color",
            "Price",
            ...(orderData?.OrderItem?.some(
              (item) => item?.productColor?.variationProduct?.discountPrice
            )
              ? ["Discount"]
              : []),
            ...(orderData?.OrderItem?.some(
              (item) =>
                item?.productColor?.variationProduct?.ram ||
                item?.productColor?.variationProduct?.rom
            )
              ? ["RAM/ROM"]
              : []),
            ...(orderData?.OrderItem?.some(
              (item) => item?.productColor?.variationProduct?.sim
            )
              ? ["SIM"]
              : []),
            ...(orderData?.OrderItem?.some((item) => item?.extraWarranty)
              ? ["Warranty", "Warranty Price"]
              : []),
            "Quantity",
            "Total",
          ]}
          data={orderData?.OrderItem || []}
          renderRow={(item, index) => {
            const productImage =
              item?.product?.ProductImage?.find(
                (img) => img.colorId === item?.productColor?.color?.id
              ) || item?.product?.ProductImage?.[0];
            console.log(item);
            return (
              <>
                {/* Mandatory Columns */}
                <td className="px-4 py-2">
                  <strong>{index + 1}</strong>
                </td>
                <td className="px-4 py-2">
                  {productImage && (
                    <img
                      src={productImage.imageUrl}
                      alt={productImage.alt || item?.product?.productName}
                      className="w-16 h-16 object-contain rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {item?.product?.productName}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {item?.productColor?.color?.color}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {item?.productColor?.variationProduct?.price?.toLocaleString()}{" "}
                    ৳
                  </span>
                </td>

                {/* Conditional Discount Column */}
                {orderData?.OrderItem?.some(
                  (i) => i?.productColor?.variationProduct?.discountPrice
                ) && (
                  <td className="px-4 py-2">
                    <span className="text-blue-500 font-medium">
                      {item?.productColor?.variationProduct?.discountPrice?.toLocaleString() ||
                        "N/A"}{" "}
                      ৳
                    </span>
                  </td>
                )}

                {/* Conditional RAM/ROM Column */}
                {orderData?.OrderItem?.some(
                  (i) =>
                    i?.productColor?.variationProduct?.ram ||
                    i?.productColor?.variationProduct?.rom
                ) && (
                  <td className="px-4 py-2">
                    <span className="text-blue-500 font-medium">
                      {[
                        item?.productColor?.variationProduct?.ram,
                        item?.productColor?.variationProduct?.rom,
                      ]
                        .filter(Boolean)
                        .join(" / ") || "N/A"}
                    </span>
                  </td>
                )}

                {/* Conditional SIM Column */}
                {orderData?.OrderItem?.some(
                  (i) => i?.productColor?.variationProduct?.sim
                ) && (
                  <td className="px-4 py-2">
                    <span className="text-blue-500 font-medium">
                      {item?.productColor?.variationProduct?.sim || "N/A"}
                    </span>
                  </td>
                )}

                {/* Conditional Warranty Columns */}
                {orderData?.OrderItem?.some((i) => i?.extraWarranty) && (
                  <>
                    <td className="px-4 py-2">
                      {item?.extraWarranty?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {item?.extraWarranty?.price?.toLocaleString() || "N/A"} ৳
                    </td>
                  </>
                )}

                {/* Mandatory Columns */}
                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {item?.quantity}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {(item?.price * item?.quantity)?.toLocaleString()} ৳
                  </span>
                </td>
              </>
            );
          }}
          selectedRows={undefined}
          onRowSelect={undefined}
          onSelectAll={undefined}
        />
      </div>

      <div className="">
        {/* New Gift Items Section - Only show if there are gifts */}
        {orderData?.OrderItem?.some((item) => item.gift) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-primary text-gray-500 mb-4">
              Free Gift From KRY
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orderData.OrderItem.filter((item) => item.gift).map(
                (item, index) => (
                  <div
                    key={`gift-${index}`}
                    className="border border-blue-100 rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.gift.image}
                          alt={item.gift.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-md font-semibold text-blue-800 truncate">
                          {item.gift.name}
                        </h4>
                        <p className="text-sm text-blue-600">
                          Quantity: {item.gift.quantity}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            FREE GIFT
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Optional: Show which product this gift came with */}
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-gray-500">
                        Included with: {item.product.productName}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
      {/* Billing Information */}

      {/* {orderData?.OrderBillingInfo?.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Billing Information
          </h3>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {orderData?.OrderBillingInfo[0]?.name}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {orderData?.OrderBillingInfo[0]?.address}
            </p>
            <p>
              <strong>City:</strong> {orderData?.OrderBillingInfo[0]?.city}
            </p>
            <p>
              <strong>District:</strong>{" "}
              {orderData?.OrderBillingInfo[0]?.district}
            </p>
            <p>
              <strong>Phone:</strong> {orderData?.OrderBillingInfo[0]?.phone}
            </p>
            <p>
              <strong>Email:</strong> {orderData?.OrderBillingInfo[0]?.email}
            </p>
          </div>
        </div>
      )} */}

      {/* Tracking Details Table */}
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
            {orderData?.OrderTracking?.map((shipping, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">
                  {new Date(shipping?.createdAt).toLocaleDateString()}
                </td>
                <td>{new Date(shipping?.createdAt).toLocaleTimeString()}</td>
                <td>{shipping?.note || "N/A"}</td>
                <td>
                  {shipping?.user
                    ? `${shipping?.user?.name} (${shipping?.user?.role})`
                    : ""}
                </td>
                {/* <td>{shipping?.user?.name || ""} ({shipping?.user?.role || ""})</td> */}
                <td>{shipping?.orderStatus || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ChangeStatus
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionItem={orderData}
      />
    </div>
  );
}
