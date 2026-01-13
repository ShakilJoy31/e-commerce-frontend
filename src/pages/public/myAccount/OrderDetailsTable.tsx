import {
  useCreateReOrderMutation,
  useGetOrderByOrderIdQuery,
} from "@/components/store/api/order/orderApi";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ButtonLoader from "@/components/loader/ButtonLoader";
import PDFInvoice from "./PDFInvoice";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import OrderInvoicePrintSingle from "@/pages/dashboard/order/OrderInvoicePrintSingle";
// import { usePaymentInstanceMutation } from "@/components/store/api/payment/paymentApi";

interface OrderDetailsTableProps {
  id: string;
  setIsDetailsDialogOpen: any;
}

const OrderDetailsTable = ({
  id,
  setIsDetailsDialogOpen,
}: OrderDetailsTableProps) => {
  console.log(id);
  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderByOrderIdQuery(id || "");
  const invoiceRef = useRef<HTMLDivElement>(null);
  const reactToPrintInvoice = useReactToPrint({ contentRef: invoiceRef });

  // const [paymentInstance, { isLoading: instanceloading }] =
  //   usePaymentInstanceMutation();
  const [createReOrder, { isLoading: reorderLoading }] =
    useCreateReOrderMutation();

  // Format date to match the image example
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Extract order data
  const orderData = order?.data;
  const orderItems = orderData?.OrderItem || [];

  // Calculate order totals
  const subtotal = orderItems?.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const discount = orderData?.couponDiscount || 0;
  const shipping = orderData?.shippingCharge || 0;
  const pointDiscount = orderData?.totalPointDiscount || 0;
  const gatewayCharge = orderData?.gatewayChargeAmount || 0;
  const conditionFee = orderData?.conditionFee;
  const orderTotal = subtotal + shipping + gatewayCharge;

  const ShoppingDetails = order?.data?.OrderShippingInfo[0];
  const OrderInfo = order?.data;

  const createReOrderHandler = async (id: number) => {
    try {
      const result = await createReOrder(id).unwrap();

      if (result?.success) {
        toast.success(result?.message);
        setIsDetailsDialogOpen(false);
      }
    } catch (error) {
      // @ts-ignore
      toast.error(error?.data?.message);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const paymentResponse = await paymentInstance({
  //       id: orderData?.id,
  //     }).unwrap();

  //     if (paymentResponse?.success) {
  //       window.location.href = paymentResponse.data.url;
  //     } else {
  //       toast.error("Payment Initialization Failed");
  //     }
  //   } catch (paymentError) {
  //     console.error("Payment instance error:", paymentError);
  //     toast.error("Payment Error");
  //   }
  // };

  if (isLoading)
    return (
      <div className="text-center py-8">
        <LoaderSpinner />
      </div>
    );
  if (isError)
    return <div className="text-center py-8">Error loading order details</div>;
  if (!order) return <div className="text-center py-8">Order not found</div>;

  return (
    <div className="p-0 lg:p-2">
      {order?.data?.orderType === "Order" &&
        !["PENDING", "CANCELLED"].includes(order?.data?.orderStatus) && (
          <div className="flex items-center gap-3 justify-end pt-3">
            {/* {orderData?.paymentAmount === 0 &&
        orderData?.paymentAmountRequest > 0 ? (
          <>
            <Button
              onClick={handleSubmit}
              className="bg-red-500 hover:bg-red-600 text-white h-7 lg:h-9 px-2 lg:px-4 lg:py-1 rounded-lg shadow-md"
            >
              {instanceloading && <ButtonLoader />}
              Retry Payment
            </Button>
          </>
        ) : (
          ""
        )} */}
            <div>
              <Button
                onClick={() => reactToPrintInvoice()}
                variant="default"
                className="w-full flex justify-start p-1 px-2 lg:px-4 h-7 lg:h-9"
                size="sm"
              >
                Print Invoice
              </Button>
            </div>
            <PDFDownloadLink
              document={<PDFInvoice data={order?.data} />}
              fileName={`${orderData?.orderId} ◉ Invoice.pdf`}
            >
              {({ loading }) =>
                loading ? (
                  <Button
                    disabled={loading}
                    className="transition-all p-3 duration-150"
                    variant="outline"
                    size="sm"
                  >
                    <ButtonLoader /> Pdf
                  </Button>
                ) : (
                  <div>
                    {
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 lg:h-9 px-2 lg:px-4"
                      >
                        PDF Invoice
                      </Button>
                    }
                  </div>
                )
              }
            </PDFDownloadLink>
          </div>
        )}
      <hr className="border-gray-300 mt-4 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipping Information Section */}
        <div className="bg-white p-4 shadow-md border rounded">
          <h2 className="text-lg font-bold mb-3 text-gray-500 border-b pb-2 text-center">
            Shipping Information:
          </h2>

          <table className="w-full text-gray-600">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-gray-600 font-medium w-1/3">
                  Name:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {ShoppingDetails?.name || "N/A"}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-gray-600 font-medium">
                  Mobile No:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {ShoppingDetails?.phone || "N/A"}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-gray-600 font-medium">
                  Address:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {ShoppingDetails?.district || "N/A"},{" "}
                  {ShoppingDetails?.city || "N/A"},{" "}
                  {ShoppingDetails?.thana || "N/A"},{" "}
                  {ShoppingDetails?.address || "N/A"}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-gray-600 font-medium">
                  Shipping Status:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {order?.data?.orderStatus || "Not yet shipped"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 border-b text-gray-600 font-medium">
                  Delivered By:
                </td>
                <td className="py-2 px-2 border-b font-medium border-l">
                  {orderData?.deliveredBy || "Not Assigned Yet"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-gray-600 font-medium">Note:</td>
                <td className="py-2 px-2 font-medium border-l">
                  {orderData?.customerNote || "Not Found"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Information Section */}
        <div className="bg-white p-4 border shadow-md rounded">
          <h2 className="text-lg font-bold mb-3 text-gray-500 border-b pb-2">
            Order#{orderData?.orderId}
          </h2>

          <table className="w-full text-gray-600">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-gray-600 font-medium">
                  Order Date:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {formatDate(orderData?.createdAt)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-gray-600 font-medium">
                  Order Status:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {orderData?.orderStatus || "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="py-2 px-2 text-gray-600 font-bold text-center border-gray-100 border-b"
                >
                  Billing Information
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-gray-600 font-medium">
                  Payment Method:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {OrderInfo?.paymentMethod || "N/A"}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-gray-600 font-medium">
                  Partial Payment Method:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {OrderInfo?.partialPaymentMethod || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-gray-600 font-medium">
                  Payment Status:
                </td>
                <td className="py-2 px-2 font-medium border-l">
                  {OrderInfo?.paymentStatus === true ? "Paid" : "Unpaid"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white p-2 lg:p-4 border shadow-md rounded mt-4">
        <table className="w-full border-collapse">
          <thead className="border bg-primary text-white">
            <tr className="border-b">
              <th className="text-center py-2 font-semibold w-10">#</th>
              <th className="text-center py-2 font-semibold">Name</th>
              <th className="text-center py-2 font-semibold">Price</th>
              <th className="text-center py-2 font-semibold">Qty</th>
              <th className="text-center py-2 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item: any, index: number) => (
              <tr
                key={`${item.product?.id || index}`}
                className="border-b text-center"
              >
                <td className="py-2 text-gray-600 border">{index + 1}</td>
                <td className="py-2 pl-1 border-r">
                  <p className="font-bold text-primary">
                    {item.product?.productName || ""}
                  </p>
                </td>
                <td className=" py-2 border-r pr-2 text-gray-600">
                  BDT {item.price?.toLocaleString()}
                </td>
                <td className=" py-2 border-r pr-2 text-gray-600">
                  {item.quantity}
                </td>
                <td className=" py-2 border-r pr-2 text-gray-500 font-semibold">
                  BDT {(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full px-2 space-y-2 mt-3">
          <div className="flex justify-between">
            <p className="text-right font-medium">Sub-Total:</p>
            <p className="text-right text-gray-600">
              BDT {subtotal.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-right font-medium">Gateway charge:</p>
            <p className="text-right text-gray-600">
              BDT {gatewayCharge.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-right font-medium">Shipping:</p>
            <p className="text-right text-gray-600">
              BDT {shipping.toLocaleString()}
            </p>
          </div>
          <hr className="border-gray-300 my-2" />
          <div className="flex justify-between">
            <p className="text-right font-medium">Order Total:</p>
            <p className="text-right font-bold text-gray-600">
              BDT {orderTotal.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-right font-medium">Coupon discount:</p>
            <p className="text-right font-bold text-gray-600">
              -BDT {discount.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-right font-medium">Points discount:</p>
            <p className="text-right font-bold text-gray-600">
              - BDT {pointDiscount.toLocaleString()}
            </p>
          </div>
          {conditionFee > 0 ? (
            <div className="flex justify-between">
              <p className="text-right font-medium">Conditoin Fee:</p>
              <p className="text-right font-bold text-gray-600">
                BDT {conditionFee?.toLocaleString()}
              </p>
            </div>
          ) : (
            ""
          )}
          <div className="flex justify-between">
            <p className="text-right font-medium">Grand total:</p>
            <p className="text-right font-bold text-gray-600">
              BDT {order?.data?.totalAmount?.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-right font-medium">Total Payment:</p>
            <p className="text-right font-bold text-gray-600">
              BDT {order?.data?.paymentAmount?.toLocaleString()}
            </p>
          </div>

          {
            <div className="flex justify-between">
              <p className="text-right font-medium">Total Due:</p>
              <p className="text-right font-bold text-gray-600">
                BDT{" "}
                {(
                  order?.data?.totalAmount - (order?.data?.paymentAmount || 0)
                ).toLocaleString()}
              </p>
            </div>
          }
        </div>

        {/* Re-order Button */}
        <div className="text-center mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className={`cursor-pointer  w-full flex items-center justify-center `}
              >
                <label className={`cursor-pointer`}>Re-order</label>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to do re-order?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn-destructive-fill">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => createReOrderHandler(order?.data?.id)}
                >
                  <button className="bg-primary flex justify-center items-center hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full">
                    {reorderLoading && <ButtonLoader />} Confirm
                  </button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="invisible hidden -left-full">
        {order?.data && (
          <OrderInvoicePrintSingle ref={invoiceRef} orderData={order?.data} />
        )}
      </div>
    </div>
  );
};

export default OrderDetailsTable;
