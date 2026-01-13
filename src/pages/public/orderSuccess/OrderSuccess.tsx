import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { BsCheckCircle } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";

const OrderSuccess = () => {
  return (
    <div>
      <div className="bg-other_bg bg-cover py-16">
        <SectionWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center">CHECKOUT</h2>
          <h2 className="text-[14px] font-medium flex items-center">
            HOME{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Checkout
          </h2>
        </SectionWrapper>
      </div>
      <SectionWrapper>
        <div className=" flex flex-col items-center justify-center px-4 py-8">
          {/* Success Icon and Message */}
          <div className="flex flex-col items-center mb-8">
            <BsCheckCircle size={64} className="text-primary mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              Thank you, Your order has been received.
            </h2>
          </div>

          {/* Order Details */}
          <div className="w-full  bg-white rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 lg:gap-5 gap-2 text-[#5D5D5D] text-sm  rounded-t-lg">
              <div className="md:col-span-1 mb-2 md:mb-0 bg-[#F7F0FF]/50 py-4 px-6 text-center w-full h-full">
                <span className="font-semibold">Order number:</span> 12011
              </div>
              <div className="md:col-span-1 mb-2 md:mb-0 bg-[#F7F0FF]/50 py-4 px-6 text-center w-full h-full">
                <span className="font-semibold">Date:</span> December 15, 2024
              </div>
              <div className="md:col-span-1 mb-2 md:mb-0 bg-[#F7F0FF]/50 py-4 px-6 text-center w-full h-full">
                <span className="font-semibold">Email:</span>{" "}
                zahid.info@gmail.com
              </div>
              <div className="md:col-span-1 mb-2 md:mb-0 bg-[#F7F0FF]/50 py-4 px-6 text-center w-full h-full">
                <span className="font-semibold">Total:</span> 65,100 ৳
              </div>
              <div className="md:col-span-1 bg-[#F7F0FF]/50 py-4 px-6 text-center w-full h-full">
                <span className="font-semibold">Payment method:</span> Cash on
                delivery
              </div>
            </div>

            {/* Product Table */}
            <table className="w-full text-left text-gray-600 border-t">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Samsung Galaxy S23 special</td>
                  <td className="py-3 px-4 text-right">65,000 ৳</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Subtotal</td>
                  <td className="py-3 px-4 text-right">65,000 ৳</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Shipping</td>
                  <td className="py-3 px-4 text-right">65,000 ৳</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Payment method</td>
                  <td className="py-3 px-4 text-right">
                    Regular Home Delivery 100 ৳
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Total</td>
                  <td className="py-3 px-4 text-right font-semibold">
                    65,100 ৳
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Track Order */}
            <div className="flex justify-end p-4 border-t">
              <a
                href="#"
                className="text-primary flex items-center gap-2 hover:underline"
              >
                <FaTruck />
                Track your order
              </a>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default OrderSuccess;
