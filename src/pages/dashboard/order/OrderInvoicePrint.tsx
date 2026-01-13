import Barcode from "react-barcode";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import React from "react";
import { timeDateFormatter } from "@/utils/helper/timeDateFormatter";

interface IOrderInvoicePrintProps {
  orderData: any[];
}

const OrderInvoicePrint = React.forwardRef<
  HTMLDivElement,
  IOrderInvoicePrintProps
>(({ orderData }, ref) => {
  const calculateTotalExtraWarranty = (order: any) => {
    let total = 0;
    order?.OrderItem?.forEach((item: any) => {
      if (item.extraWarranty?.price) {
        total += item.extraWarranty.price * item.quantity;
      }
    });
    return total;
  };

  // Helper function to get variation details
  const getVariationDetails = (item: any) => {
    const variation =
      item.variationProduct || item.product?.VariationProduct?.[0];
    if (!variation) return null;
    const details: string[] = [];

    if (variation.ram) details.push(`${variation.ram}GB RAM`);
    if (variation.rom) details.push(`${variation.rom}GB ROM`);
    if (variation.size) details.push(`Size: ${variation.size}`);
    if (variation.sim) details.push(`SIM: ${variation.sim}`);
    if (variation.region) details.push(`Region: ${variation.region}`);
    if (variation.chipset) details.push(`Chipset: ${variation.chipset}`);
    if (item.productColor?.color?.color)
      details.push(`Color: ${item.productColor.color.color}`);

    return details.length > 0 ? details.join(", ") : null;
  };

  return (
    <section ref={ref} className="printable-invoice">
      {orderData.map((order) => {
        const totalExtraWarranty = calculateTotalExtraWarranty(order);
        const subtotal = order?.OrderItem?.reduce(
          (acc: number, item: any) => acc + item.price * item.quantity,
          0
        );
        
        // Discount calculations
        const couponDiscount = order?.couponDiscount || 0;
        const pointDiscount = order?.totalPointDiscount || 0;
        const totalDiscount = couponDiscount + pointDiscount;
        
        // Fees calculations
        const shippingFee = order?.shippingCharge || 0;
        const gatewayCharge = order?.gatewayChargeAmount || 0;
        const conditionFee = order?.conditionFee || 0;
        
        // Payment calculations
        const payment = order?.paymentAmount || 0;
        
        // Total calculations
        const totalBeforeDiscount = subtotal + totalExtraWarranty;
        const totalAfterDiscount = totalBeforeDiscount - totalDiscount;
        const totalWithCondition=totalAfterDiscount + shippingFee + gatewayCharge + conditionFee
        
        // Due calculation
        const due = totalWithCondition - payment;
        
        const orderDate = order?.createdAt
          ? timeDateFormatter(order.createdAt)
          : "N/A";

        return (
          <section
            key={order.id}
            className="w-[200mm] h-[279mm] text-black mx-auto p-[30px] relative"
            style={{
              fontSize: "11px",
              fontFamily: "'Helvetica', 'Arial', sans-serif",
              backgroundImage: `url(${appConfiguration?.invoiceBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Content */}
            <div className="relative z-10 mt-28">
              {/* Header */}
              <div className="flex justify-between mb-[10px]">
                <div className="flex flex-col">
                  <label className="text-xs">Date & Time</label>
                  <p className="text-xs">
                    {timeDateFormatter(order?.OrderItem?.[0]?.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col">
                  <Barcode
                    displayValue={false}
                    value={order?.orderId || "404NOTFOUND"}
                    width={1.3}
                    height={23}
                    marginTop={0.5}
                    marginBottom={3}
                    marginRight={0.5}
                    marginLeft={0.5}
                  />
                  <div>
                    <p className="text-sm font-[600] bg-white px-1.5 text-center leading-3 tracking-widest uppercase text-black mt-0.5">
                      {order?.orderId || "404NOTFOUND"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-black mb-[10px]"></div>

              {/* Invoice title */}
              <h3 className="text-4xl font-light leading-6 text-center uppercase tracking-wide mb-6">
                Invoice
              </h3>

              {/* Customer and Order Information */}
              <div className="flex justify-between mb-[10px]">
                {/* Shipping Information */}
                <div className="w-[48%] border border-black bg-white/90">
                  <div className="border-b border-black p-[4px] font-bold text-center text-[11px]">
                    Shipping Information
                  </div>
                  <div className="flex border-b border-black">
                    <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                      Name
                    </div>
                    <div className="flex-2 p-[4px] text-[10px]">
                      {order?.OrderShippingInfo?.[0]?.name || "N/A"}
                    </div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                      Mobile No
                    </div>
                    <div className="flex-2 p-[4px] text-[10px]">
                      {order?.OrderShippingInfo?.[0]?.phone?.replace(
                        /^(\+88)/,
                        ""
                      ) || "N/A"}
                    </div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                      Shipping Method
                    </div>
                    <div className="flex-2 p-[4px] text-[10px]">
                      {order?.shippingMethod || ""}
                    </div>
                  </div>
                  <div className="flex border-black">
                    <div className="flex-1 px-[4px] font-bold text-[10px]">
                      Address
                    </div>
                    <div className="flex-2 px-[4px] text-[10px]">
                      {order?.OrderShippingInfo?.[0]?.address},{" "}
                      {order?.OrderShippingInfo?.[0]?.area},{" "}
                      {order?.OrderShippingInfo?.[0]?.zone},{" "}
                      {order?.OrderShippingInfo?.[0]?.city}
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="w-[48%] border border-black bg-white/90">
                  <div className="border-b border-black p-[4px] font-bold text-center text-[11px]">
                    Order #: {order?.orderId}
                  </div>
                  <div className="flex border-b border-black">
                    <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                      Order Date
                    </div>
                    <div className="flex-2 p-[4px] text-[10px]">
                      {orderDate}
                    </div>
                  </div>
                  <div className="mt-[5px] font-bold text-center">
                    Billing Information
                  </div>
                  <div className="flex border-b border-t border-black">
                    <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                      Payment Method
                    </div>
                    <div className="flex-2 p-[4px] text-[10px]">
                      {order?.paymentMethod || "N/A"}
                    </div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                      Payment Status
                    </div>
                    <div className="flex-2 p-[4px] text-[10px]">
                      {order?.paymentStatus ? "Paid" : "Pending"}
                    </div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                      Order Status
                    </div>
                    <div className="flex-2 p-[4px] text-[10px]">
                      {order?.orderStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Information */}
              <div className="font-bold text-[12px] mb-[10px]">Product(s)</div>
              <div className="w-full border border-black mb-[10px] bg-white/90">
                {/* Table Header */}
                <div className="flex bg-[#f0f0f0] font-bold border-b border-black">
                  <div className="w-[40%] border-r border-black p-[4px] text-[10px]">
                    Name
                  </div>
                  {order?.OrderItem?.some(
                    (item) => item.imei || item.serialNo
                  ) && (
                    <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                      IMEI/Serial No
                    </div>
                  )}
                  {order?.OrderItem?.some(
                    (item) => item?.extraWarranty?.name
                  ) && (
                    <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                      Warranty
                    </div>
                  )}
                  <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                    Price
                  </div>
                  <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                    Qty
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    Total
                  </div>
                </div>

                {/* Table Rows */}
                {order?.OrderItem?.map((item: any, idx: number) => {
                  const variationDetails = getVariationDetails(item);
                  return (
                    <div key={idx} className="flex border-b border-black">
                      <div className="w-[40%] border-r border-black p-[4px] text-[10px]">
                        {item.product?.productName || "Unknown"}
                        {variationDetails && (
                          <span className="text-gray-500 text-[9px] block">
                            ({variationDetails})
                          </span>
                        )}
                      </div>

                      {order?.OrderItem?.some(
                        (item) => item.imei || item.serialNo
                      ) && (
                        <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                          {item.imei || item.serialNo || "N/A"}
                        </div>
                      )}
                      {item?.extraWarranty && (
                        <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                          {item?.extraWarranty?.name}
                        </div>
                      )}

                      <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                        BDT {item.price}
                      </div>
                      <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                        {item.quantity}
                      </div>
                      <div className="w-[15%] p-[4px] text-[10px] text-center">
                        BDT {item.price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Table */}
              <div className="w-full border border-black mb-[10px] bg-white/90">
                {/* Subtotal */}
                <div className="flex border-b border-black">
                  <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                    Subtotal:
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    BDT {subtotal}
                  </div>
                </div>

                {/* Extra Warranty */}
                {totalExtraWarranty > 0 && (
                  <div className="flex border-b border-black">
                    <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                      Extra Warranty:
                    </div>
                    <div className="w-[15%] p-[4px] text-[10px] text-center">
                      BDT {totalExtraWarranty}
                    </div>
                  </div>
                )}

                {/* Total Before Discount */}
                <div className="flex border-b border-black">
                  <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                    Total Before Discount:
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    BDT {totalBeforeDiscount}
                  </div>
                </div>

                {/* Discounts */}
                {couponDiscount > 0 && (
                  <div className="flex border-b border-black">
                    <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                      Coupon Discount:
                    </div>
                    <div className="w-[15%] p-[4px] text-[10px] text-center">
                      -BDT {couponDiscount}
                    </div>
                  </div>
                )}

                {pointDiscount > 0 && (
                  <div className="flex border-b border-black">
                    <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                      Point Discount:
                    </div>
                    <div className="w-[15%] p-[4px] text-[10px] text-center">
                      -BDT {pointDiscount}
                    </div>
                  </div>
                )}

                {/* Total After Discount */}
                <div className="flex border-b border-black">
                  <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                    Total After Discount:
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    BDT {totalAfterDiscount}
                  </div>
                </div>

                {/* Shipping Fee */}
                <div className="flex border-b border-black">
                  <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                    Shipping:
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    BDT {shippingFee}
                  </div>
                </div>

                {/* Gateway Charge */}
                <div className="flex border-b border-black">
                  <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                    Gateway Charge:
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    BDT {gatewayCharge}
                  </div>
                </div>

               

               

                 <div className="flex border-b border-black font-bold">
                  <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                   Grand Total:
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    BDT {totalWithCondition}
                  </div>
                </div>

                {/* Payment */}
                <div className="flex border-b border-black font-bold">
                  <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                    Total Payments:
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    BDT {payment}
                  </div>
                </div>

                  {/* Condition Fee */}
                {conditionFee > 0 && (
                  <div className="flex font-bold border-b border-black">
                    <div className="w-[85%] border-r border-black p-[4px] text-[12px] text-right">
                      Condition Fee:
                    </div>
                    <div className="w-[15%] p-[4px] text-[10px] text-center">
                      BDT {conditionFee}
                    </div>
                  </div>
                )}

                {/* Due */}
                <div className="flex font-bold">
                  <div className="w-[85%] border-r border-black p-[4px] text-[12px] text-right">
                    Due:
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    BDT {due}
                  </div>
                </div>
              </div>

              {/* Order Tracking Notes */}
              {order?.OrderTracking?.some(
                (track) => track.orderStatus === "CONFIRMED"
              ) && (
                <div className="w-full border border-black mb-[10px] bg-white/90 p-[10px]">
                  <div className="font-bold text-[12px] mb-[5px]">Notes:</div>
                  <ul className="list-disc pl-[15px] text-[10px]">
                    {order.OrderTracking.map(
                      (track) =>
                        track.orderStatus === "CONFIRMED" && (
                          <li key={track.id}>{track.orderStatus}</li>
                        )
                    )}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="text-[10px] text-left bg-white/90 p-2">
                Vat & Tax are included on MRP.
              </div>
              <div className="flex justify-between mt-4">
                <div className="border-t w-[200px] border-black text-start bg-white/90 p-2">
                  Customer Signature
                </div>
                <div className="border-t w-[200px] border-black text-end bg-white/90 p-2">
                  Authorized Signature
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </section>
  );
});

OrderInvoicePrint.displayName = "OrderInvoicePrint";

export default OrderInvoicePrint;