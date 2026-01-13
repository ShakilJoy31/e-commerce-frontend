import { Chart as ChartJS, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState } from "react";
import { useGetSalesReportQuery } from "@/components/store/api/report/reportApi";
import {
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

// Register Chart.js components globally
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SalesReport() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch dynamic data from API
  const { data: salesReport, isLoading } = useGetSalesReportQuery({
    days: timeRange,
  });

  // Extract daily sales data
  const dailySales = salesReport?.daily || [];

  // Generate chart labels (dates) and dataset (items sold)
  const labels = dailySales.map((entry) => entry.date);
  const itemsSoldData = dailySales.map((entry) => entry.items || 0);

  // Define chart data dynamically
  const data = {
    labels,
    datasets: [
      {
        label: "Items Sold",
        data: itemsSoldData,
        backgroundColor: "#4CAF50",
      },
    ],
  };

  // Chart options
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { color: "#e5e7eb" },
      },
      y: {
        ticks: { color: "#6b7280" },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md lg:h-[450px]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold mb-2">Sales Report</h3>
        <select
          className="px-2 py-1 border rounded-md text-xs"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="30" className="text-xs">Last 30 Days</option>
          <option value="14" className="text-xs">Last 14 Days</option>
          <option value="7" className="text-xs">Last 7 Days</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : (
        <>
          <p className="text-xl font-bold">{salesReport?.totalItemsSold || 0}</p>
          <span className="text-base font-bold">Items Sold</span>
          <p className="text-xl font-semibold pt-3">BDT {salesReport?.totalRevenue?.toLocaleString("en-IN")} ৳ </p>
          <span className="text-base font-bold">Revenue</span>
          <div className="mt-10 lg:h-[230px]">
            <Bar data={data} options={options} />
          </div>
        </>
      )}
    </div>
  );
}
