import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useGetOrderCountByLocationQuery } from "@/components/store/api/report/reportApi";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function OrderCountByLocation() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch order count by location dynamically
  const { data: orderCountData, isLoading } = useGetOrderCountByLocationQuery({
    days: timeRange,
  });

  console.log(orderCountData);

  // Extract dynamic labels (locations) and data (order counts)
  const labels = orderCountData?.data?.map((item) => item.location) || [];
  const dataValues = orderCountData?.data?.map((item) => item.count) || [];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Order Product",
        data: dataValues,
        backgroundColor: "#3B82F6", // Blue bars for each location
        borderRadius: 5,
        hoverBackgroundColor: "#2563EB", // Darker blue on hover
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.raw} Orders`; // Display value with "Orders" label
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Location",
          color: "#6B7280",
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Order Count",
          color: "#6B7280",
          font: { size: 12 },
        },
        ticks: {
          callback: function (tickValue: string | number) {
            // If tickValue is a number, format it with commas
            if (typeof tickValue === "number") {
              return tickValue.toLocaleString();
            }
            return tickValue; // If tickValue is a string, return it as is
          },
        },
      },
    },
  };

  // Calculate total order count dynamically
  const totalOrderCount = dataValues.reduce((sum, value) => sum + value, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Order Count By Location</h2>
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
          {/* Bar Chart */}
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No Data Available</div>
      )}

      {/* Total Order Count */}
      <div className="flex justify-between text-sm font-semibold mt-4">
        <div>Total Order Count: {totalOrderCount}</div>
      </div>
    </div>
  );
}
