import { useGetRecentOrdersQuery } from "@/components/store/api/report/reportApi";

export default function RecentOrderTable() {
  // Fetch dynamic data from API
  const { data: recentOrders, isLoading } = useGetRecentOrdersQuery({});

  return (
    <div className="p-3 bg-white rounded-lg shadow-lg lg:h-[450px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <button className="text-blue-500 hover:underline">View All</button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : (
        <div className="max-h-[400px] overflow-auto custom-scroll">
          <table className="min-w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-gray-100 shadow-md">
              <tr className="text-gray-700">
                <th className="py-3 px-1 text-center text-sm">Order ID</th>
                <th className="py-3 px-1 text-center text-sm">Date</th>
                <th className="py-3 px-1 text-center text-sm">Customer</th>
                <th className="py-3 px-1 text-center text-sm">Payment Status</th>
                <th className="py-3 px-1 text-center text-sm">Order Status</th>
                <th className="py-3 px-1 text-center text-sm">Total</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders?.data?.map((order, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-4 px-2 text-center">{order.orderId}</td>
                  <td className="py-4 px-2 text-center">{order.date}</td>
                  <td className="py-4 px-2 text-center">{order.customer}</td>
                  <td className="py-4 px-2 text-center">
                    <span
                      className={`px-2 text-xs py-1 rounded-full text-white ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full text-white ${
                        order.orderStatus === "DELIVERED"
                          ? "bg-green-500"
                          : order.orderStatus === "SHIPPED"
                          ? "bg-blue-500"
                          : order.orderStatus === "PROCESSING"
                          ? "bg-orange-500"
                          : order.orderStatus === "CANCELLED"
                          ? "bg-red-500"
                          : order.orderStatus === "RETURNED"
                          ? "bg-gray-500"
                          : order.orderStatus === "PENDING"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
