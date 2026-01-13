import { useGetReturnOrderByIdQuery } from "@/components/store/api/order/orderApi";
import { useParams } from "react-router-dom";
import Table from "@/components/ui/table";
import PrintReturnOrder from "./PrintReturnOrder";

const AdminDashboardOrderReturenTrack = () => {
  const { orderId } = useParams();
  const {
    data: order,
    isLoading,
    isError,
  } = useGetReturnOrderByIdQuery(orderId);

  const headers = [
    "SL",
    "Image",
    "Name",
    "Color",
    "Price",
    "Ram & Rom",
    "Sim",
    "Extra Warranty",
    "Warranty Price",
    "Quantity",
    "Total",
    "Reason",
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !order) {
    return <div>Error fetching order data.</div>;
  }

  const orderData = order?.data;
  console.log("return", order?.data);

  return (
    <div>
         <div className="my-5 flex justify-end">
            {/* <PDFDownloadButton data={orderData} /> */}
            <PrintReturnOrder data={orderData} />
        </div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="container space-y-4 p-4">
          {/* Return Information Section */}
          <div className="">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-500 mb-4 underline">
                Return Summary
              </h3>

              <div className="flex border-b pb-2">
                <div className="text-sm flex-1 font-medium text-gray-700">
                  Order ID
                </div>
                <div className="text-sm flex-1 text-gray-600">
                  {orderData?.order?.orderId}
                </div>
              </div>
              <div className="flex border-b pb-2">
                <div className="text-sm flex-1 font-medium text-gray-700">
                  Return Created
                </div>
                <div className="text-sm flex-1 text-gray-600">
                  {new Date(orderData?.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex  border-b pb-2">
                <div className="text-sm flex-1 font-medium text-gray-700">
                  Last Updated
                </div>
                <div className="text-sm flex-1 text-gray-600">
                  {new Date(orderData?.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex border-b pb-2">
                <div className="text-sm flex-1 font-medium text-gray-700">
                  Return Status
                </div>
                <div className="text-sm flex-1 text-gray-600 uppercase">
                  {orderData?.status}
                </div>
              </div>
              <div className="flex  border-b pb-2">
                <div className="text-sm flex-1 font-medium text-gray-700">
                  Total Return Amount
                </div>
                <div className="text-sm flex-1 font-semibold text-gray-600">
                  {orderData?.totalAmount?.toLocaleString()} ৳
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-500 mb-4">
          Return Product Summary
        </h3>

        <Table
          headers={headers}
          data={orderData?.ReturnItem || []}
          renderRow={(item, index) => {
            const orderItem = item?.orderItem;
            const product = orderItem?.product;

            // Find the product image that matches the selected color
            const productImage =
              product?.ProductImage?.find(
                (img) => img.colorId === orderItem?.productColor?.color?.id
              ) || product?.ProductImage?.[0]; // Fallback to first image if no match

            return (
              <>
                <td className="px-4 py-2">
                  <strong>{index + 1}</strong>
                </td>

                <td className="px-4 py-2">
                  {productImage && (
                    <img
                      src={productImage.imageUrl}
                      alt={productImage.alt || product?.productName}
                      className="w-16 h-16 object-contain rounded"
                    />
                  )}
                </td>

                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {product?.productName}
                  </span>
                </td>

                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {orderItem?.productColor?.color?.color}
                  </span>
                </td>

                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {orderItem?.productColor?.variationProduct?.price?.toLocaleString()}{" "}
                    ৳
                  </span>
                </td>

                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {orderItem?.productColor?.variationProduct?.ram ?? "N/A"}{" "}
                    {orderItem?.productColor?.variationProduct?.rom
                      ? `/ ${orderItem.productColor.variationProduct.rom}`
                      : ""}
                  </span>
                </td>

                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {orderItem?.productColor?.variationProduct?.sim ?? "N/A"}
                  </span>
                </td>

                <td className="px-4 py-2">
                  {orderItem?.extraWarranty ? (
                    <div className="text-blue-500 font-medium">
                      {orderItem.extraWarranty.name}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="px-4 py-2">
                  {orderItem?.extraWarranty ? (
                    <div className="text-blue-500 font-medium">
                      {orderItem.extraWarranty.price?.toLocaleString()} ৳
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {item?.quantity}
                  </span>
                </td>

                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {item?.subTotal?.toLocaleString()} ৳
                  </span>
                </td>

                <td className="px-4 py-2">
                  <span className="text-blue-500 font-medium">
                    {item?.reason}
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

    
    </div>
  );
};

export default AdminDashboardOrderReturenTrack;