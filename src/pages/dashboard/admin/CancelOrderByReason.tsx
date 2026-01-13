import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useGetCancelOrderReasonQuery } from "@/components/store/api/report/reportApi";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CancelledOrderByReason() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch cancellation reasons dynamically
  const { data: cancelOrder, isLoading } = useGetCancelOrderReasonQuery({
    days: timeRange,
  });

  console.log(cancelOrder);

  // Extract dynamic labels and data from API response
  const labels = cancelOrder?.data?.map((item) => item.reason) || [];
  const dataValues = cancelOrder?.data?.map((item) => item.percentage) || [];

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#F87171", // Red - Fake Order
          "#FBBF24", // Yellow - High Price
          "#E93B8B", // Pink - Changed Mind
          "#D4D4D8", // Gray - Out Of Zone
          "#9CA3AF", // Dark Gray - Duplicate Order
          "#F472B6", // Light Pink - Other
        ].slice(0, labels.length), // Ensure colors match data length
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
    <div className="p-2 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Cancelled Order By Reason</h2>
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
        <div className="lg:h-[400px] flex justify-center">
          {/* Doughnut Chart */}
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No Data Available</div>
      )}

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center mt-4">
        <span className="font-semibold">Order Count</span> - {cancelOrder?.totalCancelled}
      </div>
    </div>
  );
}
