import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { usePaymentInstanceMutation } from "@/components/store/api/payment/paymentApi";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoader from "@/components/loader/ButtonLoader";

const PaymentCancel = () => {
  const { id } = useParams();

  const [paymentInstance, { isLoading: instanceloading }] =
    usePaymentInstanceMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const paymentResponse = await paymentInstance({
        id: id,
      }).unwrap();

      if (paymentResponse?.success) {
        // Redirect user to payment gateway
        window.location.href = paymentResponse.data.url;
      } else {
        toast({
          title: "Payment Initialization Failed",
          description: "There was an issue processing your payment.",
        });
      }
    } catch (paymentError) {
      console.error("Payment instance error:", paymentError);
      toast({
        title: "Payment Error",
        description: "Failed to initiate online payment. Please try again.",
      });
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: "reverse",
          }}
          className="bg-red-500 text-white p-6 rounded-full"
        >
          <FiAlertTriangle className="text-5xl" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 mt-5">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          Oops! Something went wrong. Your payment was not processed.
        </p>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md"
          >
            {instanceloading && <ButtonLoader/>}
            Retry Payment
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md"
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
