import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import { forwardRef } from "react";

const OrderExcel = forwardRef(({ data }: any, ref) => {
  if (!data || !data.length) {
    return (
      <Button disabled variant={"secondary"} size="xs">
        Export
      </Button>
    );
  }

  const combinedData = data.map((order: any) => {
    const shippingInfo = order.OrderShippingInfo?.[0] || {};
    const orderItems = order.OrderItem || [];

    return {
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      orderDate: order.createdAt,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus ? "Paid" : "Pending",
      totalAmount: order.totalAmount,
      discount: order.discount,
      shippingCharge: order.shippingCharge,
      conditionFee: order.conditionFee,
      customerName: shippingInfo.name,
      customerPhone: shippingInfo.phone,
      customerEmail: shippingInfo.email,
      customerAddress: `${shippingInfo.address}, ${shippingInfo.thana}, ${shippingInfo.district}, ${shippingInfo.city}`,
      itemsCount: orderItems.length,
      items: JSON.stringify(
        orderItems.map((item: any) => ({
          productName: item.product?.productName,
          price: item.price,
          quantity: item.quantity,
          warranty: item.extraWarranty?.name || "Standard",
          subtotal: item.subTotal,
        }))
      ),
      tracking: JSON.stringify(
        order.OrderTracking?.map((track: any) => ({
          status: track.orderStatus,
          date: track.createdAt,
          note: track.note,
        }))
      ),
      cancelReason: order.cancelReason,
      courierId: order.courierId,
      shippingMethod: order.shippingMethod,
      orderSource: order.orderSource,
    };
  });

  const headers = [
    { label: "Order ID", key: "orderId" },
    { label: "Status", key: "orderStatus" },
    { label: "Order Date", key: "orderDate" },
    { label: "Payment Method", key: "paymentMethod" },
    { label: "Payment Status", key: "paymentStatus" },
    { label: "Total Amount", key: "totalAmount" },
    { label: "Discount", key: "discount" },
    { label: "Shipping Charge", key: "shippingCharge" },
    { label: "Condition Fee", key: "conditionFee" },
    { label: "Customer Name", key: "customerName" },
    { label: "Customer Phone", key: "customerPhone" },
    { label: "Customer Email", key: "customerEmail" },
    { label: "Customer Address", key: "customerAddress" },
    { label: "Items Count", key: "itemsCount" },
    { label: "Items", key: "items" },
    { label: "Tracking History", key: "tracking" },
    { label: "Note", key: "note" },
    { label: "Cancel Reason", key: "cancelReason" },
    { label: "Courier ID", key: "courierId" },
    { label: "Shipping Method", key: "shippingMethod" },
    { label: "Order Source", key: "orderSource" },
  ];

  return (
    <CSVLink
      data={combinedData}
      headers={headers}
      filename={`orders_${new Date().toISOString().slice(0, 10)}.csv`}
      ref={ref}
      className="hidden"
    >
      <Button variant={"outline"} size="sm" className="p-3">
        Export
      </Button>
    </CSVLink>
  );
});

OrderExcel.displayName = "OrderExcel";
export default OrderExcel;
