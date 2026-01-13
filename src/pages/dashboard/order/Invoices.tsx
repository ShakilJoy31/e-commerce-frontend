const Invoices = () => {
  return (
    <div className="max-w-[800px] mx-auto bg-white p-6 border border-gray-300 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-3xl font-bold text-primary">KRY International</h1>
        <div className="text-sm text-right">
          <p>BIN: 002881614-0409</p>
        </div>
      </div>

      {/* Info Tables */}
      <div className="grid grid-cols-2 gap-6 text-sm mb-4">
        {/* Shipping Information */}
         {/* Shipping Information */}
          <div>
            <h2 className="font-bold mb-2 text-center border border-black p-2 bg-gray-100">
              Shipping Information
            </h2>
            <table className="w-full border border-black">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">Name:</td>
                  <td className="p-2 border-l border-black">Md Shahriar Kabir</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">Mobile No:</td>
                  <td className="p-2 border-l border-black">01999999999</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">Address:</td>
                  <td className="p-2 border-l border-black">Mirpur-10, Dhaka</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">Area:</td>
                  <td className="p-2 border-l border-black">Mirpur</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">City:</td>
                  <td className="p-2 border-l border-black">Dhaka</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Zone:</td>
                  <td className="p-2 border-l border-black">Dhaka City North</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Order Info */}
          <div>
            <h2 className="font-bold mb-2 text-center border border-black p-2 bg-gray-100">
              Order Info
            </h2>
            <table className="w-full border border-black">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">Order ID:</td>
                  <td className="p-2 border-l border-black">SXA2023-172934</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">Order Time:</td>
                  <td className="p-2 border-l border-black">11:00 AM</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">Order Date:</td>
                  <td className="p-2 border-l border-black">Sep 01, 2023</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-medium">Payment Method:</td>
                  <td className="p-2 border-l border-black">Cash on Delivery</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Payment Status:</td>
                  <td className="p-2 border-l border-black">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>

      {/* Products Table */}
      <div className="text-sm mb-6">
        <h2 className="font-bold mb-2">Product(s)</h2>
        <table className="w-full border border-collapse">
          <thead className="bg-gray-100 border">
            <tr className="text-left">
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Unit Price</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">
                Leaves HBS Bluetooth Neckband Earphone Black
              </td>
              <td className="border px-2 py-1">1</td>
              <td className="border px-2 py-1">BDT 799</td>
              <td className="border px-2 py-1">BDT 799</td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border px-2 py-1 text-right font-semibold"
              >
                Subtotal:
              </td>
              <td className="border px-2 py-1">BDT 799</td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border px-2 py-1 text-right font-semibold"
              >
                Delivery Charge:
              </td>
              <td className="border px-2 py-1">BDT 50</td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border px-2 py-1 text-right font-semibold"
              >
                Total Price:
              </td>
              <td className="border px-2 py-1 font-bold">BDT 849</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 italic text-xs">* Vat & Tax are included on MRP.</p>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-600 mt-8 border-t pt-4">
        <p>
          <span className="font-bold">Kry International</span>
        </p>
        <p>Bashundhara City, Dhaka</p>
        <div className="flex justify-between mt-2">
          <div>Cell: +8801844478500</div>
          <div>
            Web:{" "}
            <a href="https://kryinternational.com/" className="text-blue-600">
              www.ecommerce.techelementbd.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
