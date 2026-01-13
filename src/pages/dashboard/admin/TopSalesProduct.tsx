import { useGetTopSellProductsQuery } from "@/components/store/api/report/reportApi";
import { useState } from "react";

export default function TopSalesProduct() {
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [top, setTop] = useState(5); // New state for 'top' query

  // Fetch top sales data dynamically
  const { data: topSales, isLoading } = useGetTopSellProductsQuery({
    statusFilter: timeRange,
    top: top, 
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Top Sales Product</h2>
        <div className="flex gap-3">
          {/* Time Range Filter */}
          <select
            className="px-2 py-1 border rounded-md text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>

          {/* Top Products Filter */}
          <select
            className="px-2 py-1 border rounded-md text-sm"
            value={top}
            onChange={(e) => setTop(Number(e.target.value))}
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
            <option value={20}>Top 20</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>
      </div>

      {/* Show Loader while fetching */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scroll">
          {topSales?.data?.map((product) => (
            <div
              key={product.productId}
              className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  {/* Product Name & Price */}
                  <h3 className="text-sm font-semibold w-full">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.price.toLocaleString()} ৳</p>
                </div>
              </div>
              {/* Total Sales */}
              <div className="text-sm font-semibold">{product.totalSales} Sales</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
