import { usePaymentWebhookQuery } from "@/components/store/api/payment/paymentApi";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiCheckCircle } from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import OrderDetailsTable from "../myAccount/OrderDetailsTable";
import { useState } from "react";

const PaymentSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  // Fetch order data using webhook
  const { data: orderData, isLoading } = usePaymentWebhookQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderSpinner />
      </div>
    );
  }


  if (!orderData || !orderData?.data) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-700">
        <FiCheckCircle size={50} className="text-red-500 mb-3" />
        <h2 className="text-xl font-semibold">Order Not Found</h2>
        <p className="text-gray-500">We couldn't find your order details.</p>
        <Button onClick={() => navigate("/")} className="mt-5">
          <AiOutlineArrowLeft className="mr-2" /> Go to Home
        </Button>
      </div>
    );
  }

  // Extract order details
  const {
    amount,
    bankTransId,
    cardIssuer,
    cardType,
    createdAt,
    order,
    transId,
  } = orderData?.data || {};

  const orderStatus = order?.orderStatus || "Pending";
  
  
  // Calculate amount to be paid on delivery for COD orders
  const amountToPayOnDelivery = order?.paymentMethod === "COD" 
    ? order?.totalAmount - amount 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        {/* Success Message */}
        <FiCheckCircle size={60} className="text-green-500 mx-auto mb-3" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>

        {/* Transaction Details */}
        <div className="mt-6 bg-gray-100 p-4 rounded-md text-left">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Transaction Details
          </h3>
          
          <div className="space-y-2">
            <p className="text-gray-600 flex items-start">
              <MdOutlinePayments className="inline-block text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Transaction ID:{" "}
                <span className="font-medium text-gray-800">{transId}</span>
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start">
              <MdOutlinePayments className="inline-block text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Order Date:{" "}
                <span className="font-medium text-gray-800">
                  {new Date(createdAt).toLocaleDateString()}, {new Date(createdAt).toLocaleTimeString()}
                </span>
              </span>
            </p>
            
            {/* <p className="text-gray-600 flex items-start">
              <FaMoneyBillWave className="inline-block text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Sub Total Amount:{" "}
                <span className="font-medium text-gray-800">TK. {subTotalAmount.toLocaleString()}</span>
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start">
              <FaShippingFast className="inline-block text-orange-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Shipping Charge:{" "}
                <span className="font-medium text-gray-800">
                  TK. {order?.shippingCharge?.toLocaleString()}
                </span>
              </span>
            </p> */}
            
            <p className="text-gray-600 flex items-start">
              <FaMoneyBillWave className="inline-block text-purple-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Total Amount:{" "}
                <span className="font-medium text-gray-800">
                  TK. {order?.totalAmount?.toLocaleString()}
                </span>
              </span>
            </p>

            {
              order?.paymentMethod === 'EMI' && <p className="text-gray-600 flex items-start">
              <FaMoneyBillWave className="inline-block text-purple-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                EMI Charge:{" "}
                <span className="font-medium text-gray-800">
                  TK. {amount - order?.totalAmount}
                </span>
              </span>
            </p>
            }
            
            <p className="text-gray-600 flex items-start">
              <FaMoneyBillWave className="inline-block text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Amount Paid:{" "}
                <span className="font-medium text-gray-800">TK. {amount?.toLocaleString()}</span>
              </span>
            </p>
            
            {/* Show amount to pay on delivery only for COD orders */}
            {order?.paymentMethod === "COD" && amountToPayOnDelivery > 0 && (
              <p className="text-gray-600 flex items-start">
                <FaMoneyBillWave className="inline-block text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>
                  Amount to Pay on Delivery:{" "}
                  <span className="font-medium text-gray-800">
                    TK. {amountToPayOnDelivery.toLocaleString()}
                  </span>
                </span>
              </p>
            )}
            
            <p className="text-gray-600 flex items-start">
              <MdOutlinePayments className="inline-block text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Payment Method:{" "}
                <span className="font-medium text-gray-800">
                  {order?.paymentMethod}
                </span>
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start">
              <MdOutlinePayments className="inline-block text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Card Issuer:{" "}
                <span className="font-medium text-gray-800">{cardIssuer}</span>
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start">
              <MdOutlinePayments className="inline-block text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Card Type:{" "}
                <span className="font-medium text-gray-800">{cardType}</span>
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start">
              <MdOutlinePayments className="inline-block text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Bank Transaction ID:{" "}
                <span className="font-medium text-gray-800">{bankTransId}</span>
              </span>
            </p>
            
            <p className="text-gray-600 flex items-start">
              <MdOutlinePayments className="inline-block text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <span>
                Order Status:{" "}
                <span
                  className={`font-medium ${
                    orderStatus === "PENDING" ? "text-orange-500" : "text-green-500"
                  }`}
                >
                  {orderStatus}
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Ordered Products */}
        <div className="mt-6 bg-white p-4 rounded-md shadow-md text-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Ordered Products
          </h3>
          <div className="space-y-4">
            {order?.OrderItem?.map((item, index) => {
              const product = item?.product;
              const productImage = product?.ProductImage?.[0]?.imageUrl || "";
              const productName = product?.productName || "Unknown Product";
              const productBrand = product?.brand?.brand || "Unknown Brand";
              const productPrice = item?.price || 0;
              const quantity = item?.quantity || 1;

              return (
                <div
                  key={index}
                  className="flex items-center p-3 border rounded-md shadow-sm bg-gray-50"
                >
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-16 h-16 rounded-md shadow-md mr-4 object-contain"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {productName}
                    </h3>
                    <p className="text-gray-600">
                      Brand: <span className="font-medium">{productBrand}</span>
                    </p>
                    <p className="text-gray-600">
                      Price:{" "}
                      <span className="font-medium">TK. {productPrice.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-600">
                      Quantity: <span className="font-medium">{quantity}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white"
          >
            <AiOutlineArrowLeft className="mr-2" /> Home
          </Button>
          <Dialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-white bg-primary font-bold border px-4 py-1"
              >
                View Orders
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
              {
                <OrderDetailsTable
                  id={orderData?.data?.order?.orderId}
                  setIsDetailsDialogOpen={setIsDetailsDialogOpen}
                />
              }
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;