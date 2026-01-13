import Barcode from "react-barcode";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import React from "react";
import { timeDateFormatter } from "@/utils/helper/timeDateFormatter";

interface IDeliverySlipPrintProps {
  orderData: any[];
}

const DeliverySlipPrint = React.forwardRef<
  HTMLDivElement,
  IDeliverySlipPrintProps
>(({ orderData }, ref) => {
  return (
    <section ref={ref} className="printable-invoice">
      {orderData.map((order) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const orderDate = order?.createdAt
        //   ? timeDateFormatter(order.createdAt)
        //   : "N/A";

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
            {/* Semi-transparent overlay to ensure text readability */}
            <div className="absolute inset-0 z-0"></div>

            {/* Actual content with higher z-index */}
            <div className="relative z-10 mt-28">
              {/* Header with order number and barcode */}
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
                Delivery Slip
              </h3>

              {/* Customer Information */}
              <div className="mb-[10px]">
                <div className="w-full border border-black bg-white/90">
                  <div className="border-b border-black p-[4px] font-bold text-center text-[11px]">
                    Customer Information
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
                      Address
                    </div>
                    <div className="flex-2 p-[4px] text-[10px]">
                      {order?.OrderShippingInfo?.[0]?.address},{" "}
                      {order?.OrderShippingInfo?.[0]?.area},{" "}
                      {order?.OrderShippingInfo?.[0]?.zone},{" "}
                      {order?.OrderShippingInfo?.[0]?.city}
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
                </div>
              </div>

              {/* Products Information */}
              <div className="font-bold text-[12px] mb-[10px]">Product(s)</div>
              <div className="w-full border border-black mb-[10px] bg-white/90">
                {/* Table Header */}
                <div className="flex bg-[#f0f0f0] font-bold border-b border-black">
                  <div className="w-[70%] border-r border-black p-[4px] text-[10px]">
                    Name
                  </div>
                  <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                    Warranty
                  </div>
                  <div className="w-[15%] p-[4px] text-[10px] text-center">
                    Qty
                  </div>
                </div>

                {/* Table Rows */}
                {order?.OrderItem?.map((item: any, idx: number) => (
                  <div key={idx} className="flex border-b border-black">
                    <div className="w-[70%] border-r border-black p-[4px] text-[10px]">
                      {item.product?.productName || "Unknown"}
                    </div>
                    <div className="w-[15%] border-r border-black p-[4px] text-[10px] text-center">
                      {item?.extraWarranty?.name || "3 Months"}
                    </div>
                    <div className="w-[15%] p-[4px] text-[10px] text-center">
                      {item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full border border-black mb-[10px] bg-white/90 p-[10px]">
                <div className="font-bold text-[12px] mb-[5px]">Notes:</div>
                {(() => {
                  const allNotes = [
                    // Add order note if it exists (from order.note or OrderTracking[0].note)
                    ...(order.note ? [order.note] : []),
                    ...(order.OrderTracking?.[0]?.note
                      ? [order.OrderTracking[0].note]
                      : []),
                  ].filter((note) => note); // Remove any empty notes

                  return allNotes.length > 0 ? (
                    <ul className="list-disc pl-[15px] text-[10px]">
                      {allNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[10px] pl-[15px]">N/A</p>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="text-left mt-4 bg-white/90 p-2">
                <p className="text-sm text-black leading-snug">
                  We appreciate you choosing {appConfiguration?.appName}. Your
                  satisfaction is of the utmost importance to us. Should you
                  have any inquiries or require assistance, please do not
                  hesitate to contact us through the email address or hotline
                  number provided below.
                </p>
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

DeliverySlipPrint.displayName = "DeliverySlipPrint";

export default DeliverySlipPrint;
