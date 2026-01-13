
const CustomerInfo = ({actionItem}:any) => {

  const customer = actionItem
  const orders = actionItem?.Order || [];

  return (
    <div className=" bg-gray-100 p-6 rounded-lg shadow-md">
      {/* Customer Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <img
          src={customer.avatar}
          alt={customer.name}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{customer.name}</h2>
          <p className="text-gray-600">{customer.address || "N/A"}</p>
          {/* <p className="text-gray-500">Customer for 1 year</p> */}
        </div>
        <div className="flex items-center">
          <span className="text-yellow-500 text-lg">★★★★★</span>
        </div>
      </div>

      {/* Customer Orders */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h3 className="font-semibold mb-3">Customer Orders</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Order</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Order Status</th>
              <th className="p-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">#{order.orderId}</td>
                <td className="p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      order.orderStatus === "COMPLETED"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-2 font-semibold">{order.totalAmount} ৳</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerInfo;
