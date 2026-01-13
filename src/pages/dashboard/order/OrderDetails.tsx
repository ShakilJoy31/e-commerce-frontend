import { FC } from "react";

// Define the shape of the data you will be working with
interface IDetails {
  actionItem: any;
}

const OrderDetails: FC<IDetails> = ({ actionItem }) => {
  const product = actionItem?.OrderItem[0]?.product;
  const shippingInfo = actionItem?.OrderShippingInfo[0];

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>

      {/* Product Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Product Information</h2>
        <div className="flex gap-8">
          <img
            src={product?.Image[0]?.imageUrl || ""}
            alt={product?.productName}
            className="w-40 h-40 object-cover rounded-md"
          />
          <div>
            <h3 className="text-xl font-medium">{product?.productName}</h3>
            <p className="text-gray-500 mt-2">{product?.description}</p>
            <div className="mt-4">
              <p><strong>Price:</strong> {actionItem?.OrderItem[0]?.price} Taka</p>
              <p><strong>Quantity:</strong> {actionItem?.OrderItem[0]?.quantity}</p>
              <p><strong>Sub Total:</strong> {actionItem?.OrderItem[0]?.subTotal} Taka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Product Specifications</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          <p><strong>Brand:</strong> {product?.brand?.brand}</p>
          <p><strong>Category:</strong> {product?.category?.name}</p>
          <p><strong>Color:</strong> {product?.color || "N/A"}</p>
          <p><strong>Dimensions:</strong> {product?.dimensions || "N/A"}</p>
          <p><strong>Battery Capacity:</strong> {product?.batteryCapacity || "N/A"}</p>
          {/* Add more specifications as necessary */}
        </div>
      </section>

      {/* Customer Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Customer Information</h2>
        <div className="border border-gray-300 p-4 rounded-md">
          <p><strong>Name:</strong> {shippingInfo?.name}</p>
          <p><strong>Phone:</strong> {shippingInfo?.phone}</p>
          <p><strong>Address:</strong> {shippingInfo?.address}</p>
          <p><strong>City:</strong> {shippingInfo?.city}</p>
        </div>
      </section>

      {/* Order Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Order Information</h2>
        <div className="border border-gray-300 p-4 rounded-md">
          <p><strong>Order ID:</strong> {actionItem?.orderId}</p>
          <p><strong>Status:</strong> {actionItem?.orderStatus}</p>
          <p><strong>Payment Method:</strong> {actionItem?.paymentMethod}</p>
          <p><strong>Total Amount:</strong> {actionItem?.totalAmount} Taka</p>
          <p><strong>Shipping Charge:</strong> {actionItem?.shippingCharge} Taka</p>
          <p><strong>Payment Status:</strong> {actionItem?.paymentStatus ? "Paid" : "Unpaid"}</p>
        </div>
      </section>

      {/* Additional Details */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Additional Information</h2>
        <div className="border border-gray-300 p-4 rounded-md">
          <p><strong>Coupon Applied:</strong> {actionItem?.coupon ? "Yes" : "No"}</p>
          <p><strong>EMI Option:</strong> {actionItem?.isEmi ? "Available" : "Not Available"}</p>
          <p><strong>Order Date:</strong> {new Date(actionItem?.createdAt).toLocaleString()}</p>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;
