import Barcode from "react-barcode";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import React from "react";
import { timeDateFormatter } from "@/utils/helper/timeDateFormatter";

interface IOrderInvoicePrintSingleProps {
  orderData: any; // Changed from any[] to any for single object
}

const OrderInvoicePrintSingle = React.forwardRef<
  HTMLDivElement,
  IOrderInvoicePrintSingleProps
>(({ orderData }, ref) => {
  // Calculate total extra warranty price
  const calculateTotalExtraWarranty = (order: any) => {
    let total = 0;
    order?.OrderItem?.forEach((item: any) => {
      if (item.extraWarranty?.price) {
        total += item.extraWarranty.price * item.quantity;
      }
    });
    return total;
  };

  const totalExtraWarranty = calculateTotalExtraWarranty(orderData);
  const subtotal = orderData?.OrderItem?.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );
  // const discountType = orderData?.discountType;
  const discount = orderData?.couponDiscount || 0;
  const pointDiscount = orderData?.totalPointDiscount || 0;
  const salesDiscount = orderData?.discountAmount || 0;

  // let discountAmount;
  // if (discountType === "FIXED") {
  //   discountAmount = discount;
  // } else {
  //   discountAmount = subtotal * (discount / 100);
  // }
  const shippingFee = orderData?.shippingCharge || 0;
  const gatewayCharge = orderData?.gatewayChargeAmount || 0;
  const payment = orderData?.paymentAmount || 0;
  const total = subtotal + shippingFee + gatewayCharge;
  const due = orderData?.totalAmount - payment;

  const orderDate = orderData?.createdAt
    ? timeDateFormatter(orderData.createdAt)
    : "N/A";

  // Before JSX: calculate the condition
  // Before JSX: calculate the condition
  const hasImeiOrSerial = orderData?.OrderItem?.some(
    (item: any) => item.imei || item.serialNo
  );
  const hasExtraWarranty = orderData?.OrderItem?.some(
    (item: any) => item?.extraWarranty?.name
  );

  return (
    <section ref={ref} className="printable-invoice">
      <section
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
        {/* Semi-transparent overlay to ensure text readability */}
        <div className="absolute inset-0 z-0"></div>

        {/* Actual content with higher z-index */}
        <div className="relative z-10 mt-28">
          {/* Header with order number and barcode */}
          <div className="flex justify-between mb-[10px]">
            <div className="flex flex-col">
              <label className="text-xs">Date & Time</label>
              <p className="text-xs">
                {timeDateFormatter(orderData?.OrderItem?.[0]?.createdAt)}
              </p>
            </div>

            <div className="flex flex-col">
              <Barcode
                displayValue={false}
                value={orderData?.orderId || "404NOTFOUND"}
                width={1.3}
                height={23}
                marginTop={0.5}
                marginBottom={3}
                marginRight={0.5}
                marginLeft={0.5}
              />
              <div>
                <p className="text-sm font-[600] bg-white px-1.5 text-center leading-3 tracking-widest uppercase text-black mt-0.5">
                  {orderData?.orderId || "404NOTFOUND"}
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
                  {orderData?.OrderShippingInfo?.[0]?.name || "N/A"}
                </div>
              </div>
              <div className="flex border-b border-black">
                <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                  Mobile No
                </div>
                <div className="flex-2 p-[4px] text-[10px]">
                  {orderData?.OrderShippingInfo?.[0]?.phone?.replace(
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
                  {orderData?.shippingMethod || ""}
                </div>
              </div>
              <div className="grid border-black">
                <div className="flex-1 p-[4px] font-bold text-[10px]">
                  Address
                </div>
                <div className="flex-2 px-[4px] text-[10px]">
                  {orderData?.OrderShippingInfo?.[0]?.address},{" "}
                  {orderData?.OrderShippingInfo?.[0]?.area},{" "}
                  {orderData?.OrderShippingInfo?.[0]?.zone},{" "}
                  {orderData?.OrderShippingInfo?.[0]?.city}
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="w-[48%] border border-black bg-white/90">
              <div className="border-b border-black p-[4px] font-bold text-center text-[11px]">
                Order #: {orderData?.orderId}
              </div>
              <div className="flex border-b border-black">
                <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                  Order Date
                </div>
                <div className="flex-2 p-[4px] text-[10px]">{orderDate}</div>
              </div>
              <div className="mt-[5px] font-bold text-center">
                Billing Information
              </div>
              <div className="flex border-b border-t border-black">
                <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                  Payment Method
                </div>
                <div className="flex-2 p-[4px] text-[10px]">
                  {orderData?.paymentMethod || "N/A"}
                </div>
              </div>
              <div className="flex border-b border-black">
                <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                  Payment Status
                </div>
                <div className="flex-2 p-[4px] text-[10px]">
                  {orderData?.paymentStatus ? "Paid" : "Pending"}
                </div>
              </div>
              <div className="flex border-b border-black">
                <div className="flex-1 border-r border-black p-[4px] font-bold text-[10px]">
                  Order Status
                </div>
                <div className="flex-2 p-[4px] text-[10px]">
                  {orderData?.orderStatus}
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
              {hasImeiOrSerial && (
                <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                  IMEI / Serial No
                </div>
              )}

              {hasExtraWarranty && (
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
            {orderData?.OrderItem?.map((item: any, idx: number) => (
              <div key={idx} className="flex border-b border-black">
                <div className="w-[40%] border-r border-black p-[4px] text-[10px]">
                  {item.product?.productName || "Unknown"}
                  {(item.variationProduct || item.productColor?.color) && (
                    <span className="text-gray-600">
                      {" ("}
                      {[
                        item.variationProduct?.ram &&
                          `${item.variationProduct.ram}GB RAM`,
                        item.variationProduct?.rom &&
                          `${item.variationProduct.rom}GB ROM`,
                        item.variationProduct?.size &&
                          `Size: ${item.variationProduct.size}`,
                        item.variationProduct?.sim &&
                          `SIM: ${item.variationProduct.sim}`,
                        item.variationProduct?.region &&
                          `Region: ${item.variationProduct.region}`,
                        item.variationProduct?.chipset &&
                          `Chipset: ${item.variationProduct.chipset}`,
                        item.productColor?.color?.color &&
                          `Color: ${item.productColor.color.color}`,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                      {")"}
                    </span>
                  )}
                </div>
                {hasImeiOrSerial && (
                  <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                    {item?.imei || item?.serialNo}
                  </div>
                )}
                {item?.extraWarranty?.name && (
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
            ))}
          </div>

          {/* Summary Table */}
          <div className="w-full border border-black mb-[10px] bg-white/90">
            {totalExtraWarranty > 0 && (
              <div className="flex border-b border-black">
                <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                  Extra Warranty
                </div>
                <div className="w-[15%] p-[4px] text-[10px] text-center">
                  BDT {totalExtraWarranty}
                </div>
              </div>
            )}
            <div className="flex border-b border-black">
              <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                Sub-total
              </div>
              <div className="w-[15%] p-[4px] text-[10px] text-center">
                BDT {subtotal}
              </div>
            </div>
            <div className="flex border-b border-black">
              <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                Shipping
              </div>
              <div className="w-[15%] p-[4px] text-[10px] text-center">
                BDT {shippingFee}
              </div>
            </div>
            <div className="flex border-b border-black">
              <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                Gateway Charge
              </div>
              <div className="w-[15%] p-[4px] text-[10px] text-center">
                BDT {gatewayCharge}
              </div>
            </div>

            <div className="flex border-b border-black font-bold">
              <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                Order total
              </div>
              <div className="w-[15%] p-[4px] text-[10px] text-center">
                BDT {total}
              </div>
            </div>
            <div className="flex border-b border-black font-bold">
              <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                Coupon discount
              </div>
              <div className="w-[15%] p-[4px] text-[10px] text-center">
                - BDT {discount}
              </div>
            </div>
            {pointDiscount && pointDiscount > 0 ? (
              <div className="flex border-b border-black font-bold">
                <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                  Point discount
                </div>
                <div className="w-[15%] p-[4px] text-[10px] text-center">
                  - BDT {pointDiscount}
                </div>
              </div>
            ) : (
              ""
            )}
            {salesDiscount && salesDiscount > 0 ? (
              <div className="flex border-b border-black font-bold">
                <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                  Discount
                </div>
                <div className="w-[15%] p-[4px] text-[10px] text-center">
                  - BDT {salesDiscount}
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="flex border-b border-black font-bold">
              <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                Grand total
              </div>
              <div className="w-[15%] p-[4px] text-[10px] text-center">
                BDT {orderData?.totalAmount}
              </div>
            </div>
            <div className="flex border-b border-black font-bold">
              <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                Total Payments
              </div>
              <div className="w-[15%] p-[4px] text-[10px] text-center">
                BDT {payment}
              </div>
            </div>
            {orderData?.conditionFee ? (
              <div className="flex border-b font-bold border-black">
                <div className="w-[85%] border-r border-black p-[4px] text-[12px] text-right">
                  Condition Fee
                </div>
                <div className="w-[15%] p-[4px] text-[10px] text-center">
                  BDT {orderData?.conditionFee}
                </div>
              </div>
            ) : (
              ""
            )}
            {due > 0 ? (
              <div className="flex font-bold">
                <div className="w-[85%] border-r border-black p-[4px] text-[10px] text-right">
                  Due
                </div>
                <div className="w-[15%] p-[4px] text-[10px] text-center">
                  BDT {due}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          {orderData?.OrderTracking?.some(
            (track: any) => track.orderStatus === "CONFIRMED"
          ) && (
            <div className="w-full border border-black mb-[10px] bg-white/90 p-[10px]">
              <div className="font-bold text-[12px] mb-[5px]">Notes:</div>
              <ul className="list-disc pl-[15px] text-[10px]">
                {orderData.OrderTracking.map(
                  (track: any) =>
                    track.orderStatus === "CONFIRMED" && (
                      <li key={track.id}>{track.note}</li>
                    )
                )}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="text-[10px] text-left  bg-white/90 p-2">
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
    </section>
  );
});

OrderInvoicePrintSingle.displayName = "OrderInvoicePrintSingle";

export default OrderInvoicePrintSingle;
