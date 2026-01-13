import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, BarElement, Tooltip, Legend } from "chart.js";
import { useGetOrderCycleTimeQuery } from "@/components/store/api/report/reportApi";

// Registering the necessary chart components
ChartJS.register(CategoryScale, BarElement, Tooltip, Legend);

export default function OrderCycleTime() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch dynamic order cycle time data
  const { data: orderCycleTime, isLoading } = useGetOrderCycleTimeQuery({
    days: timeRange,
  });


  // Define chart labels from API keys
  const labels = [
    "Pending",
    "On Hold",
    "Processing",
    "Shipped",
    "Cancelled",
    "Delivered",
    "Returned",
    "Ready",
  ];

  // Map API response to dataset values, ensuring missing values default to 0
  const datasetData = [
    parseFloat(orderCycleTime?.data?.PENDING || "0"),
    parseFloat(orderCycleTime?.data?.HOLD || "0"),
    parseFloat(orderCycleTime?.data?.PROCESSING || "0"),
    parseFloat(orderCycleTime?.data?.SHIPPED || "0"),
    parseFloat(orderCycleTime?.data?.CANCELLED || "0"),
    parseFloat(orderCycleTime?.data?.DELIVERED || "0"),
    parseFloat(orderCycleTime?.data?.RETURNED || "0"),
    parseFloat(orderCycleTime?.data?.READY || "0"),
  ];

  // Define chart data dynamically
  const chartData = {
    labels,
    datasets: [
      {
        label: "Order Cycle Time (Count)",
        data: datasetData,
        backgroundColor: [
          "#3490dc", // Blue - Pending
          "#f0ad4e", // Yellow - On Hold
          "#6c757d", // Gray - Processing
          "#9b59b6", // Purple - Shipped
          "#dc3545", // Red - Cancelled
          "#28a745", // Green - Delivered
          "#795548", // Brown - Returned
          "#ff7f50", // Coral - Ready
        ],
        borderColor: "#fff",
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw} Orders`, // Show counts
        },
      },
    },
    indexAxis: "y" as const, // Horizontal bar chart
    scales: {
      x: {
        beginAtZero: true, // Ensure x-axis starts at zero
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md lg:h-[350px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Order Cycle Time</h2>
        <select
          className="px-2 py-1 border rounded-md"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="30">Last 30 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="7">Last 7 Days</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full md:w-3/4 lg:h-[270px]">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
