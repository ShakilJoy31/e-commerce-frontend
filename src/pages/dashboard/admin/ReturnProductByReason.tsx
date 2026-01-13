import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { useGetReturnOrderReasonQuery } from "@/components/store/api/report/reportApi";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReturnProductByReason() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch return order reasons dynamically
  const { data: returnProduct, isLoading } = useGetReturnOrderReasonQuery({
    days: timeRange,
  });


  // Extract dynamic labels and data from API response
  const labels = returnProduct?.data?.map((item) => item.reason.replace("_", " ")) || [];
  const dataValues = returnProduct?.data?.map((item) => item.percentage) || [];

  // Assign colors dynamically
  const colors = [
    "#F87171", // Damage Product (Red)
    "#FBBF24", // Delay Delivery (Yellow)
    "#60A5FA", // Wrong Product (Blue)
    "#D4D4D8", // Out Of Zone (Gray)
    "#9CA3AF", // Fraud Customer (Dark Gray)
    "#F472B6", // Delivery Man Careless (Pink)
    "#FECACA", // Other (Light Red)
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors.slice(0, labels.length), // Ensure colors match data length
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.raw}%`; // Display percentage in tooltip
          },
        },
      },
      legend: {
        position: "left",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Return Product By Reason</h2>
        <div className="flex gap-3">
          {/* Time Range Selector */}
          <select
            className="px-2 py-1 border rounded-md text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="30">Last 30 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Show loader if data is still loading */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : labels.length > 0 ? (
        <div>
          {/* Doughnut Chart */}
          <Doughnut data={chartData} options={options} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No Data Available</div>
      )}

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center mt-4">
        <span className="font-semibold">Return product</span> - {returnProduct?.totalReturned}
      </div>
    </div>
  );
}
