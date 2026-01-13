import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetReturnOrderByIdQuery } from "@/components/store/api/order/orderApi";
import Table from "@/components/ui/table";
import { useEffect, useState } from "react";
import LoaderSpinner from "@/components/loader/LoaderSpinner";

interface ReturnOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const ReturnOrderModal = ({ isOpen, onClose, orderId }: ReturnOrderModalProps) => {
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
  ];

  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (order) {
      setOrderData(order.data);
    }
  }, [order]);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Order Details</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4"><LoaderSpinner /></div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !orderData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Order Details</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4 text-red-500">
            Error fetching order data.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Return Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Return Information Section */}
          <div className="bg-white rounded-lg shadow p-4">
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
              <div className="flex border-b pb-2">
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
              <div className="flex border-b pb-2">
                <div className="text-sm flex-1 font-medium text-gray-700">
                  Total Return Amount
                </div>
                <div className="text-sm flex-1 font-semibold text-gray-600">
                  {orderData?.totalAmount?.toLocaleString()} ৳
                </div>
              </div>
              <div className="flex border-b pb-2">
                <div className="text-sm flex-1 font-medium text-gray-700">
                  Return Reason
                </div>
                <div className="text-sm flex-1 font-semibold text-red-600">
                  {orderData?.reason}
                </div>
              </div>
            </div>
          </div>

          {/* Return Product Summary */}
          <div className="bg-white rounded-lg shadow p-4">
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

                  
                  </>
                );
              }}
              selectedRows={undefined}
              onRowSelect={undefined}
              onSelectAll={undefined}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnOrderModal;