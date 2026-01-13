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
  TooltipItem,
} from "chart.js";
import { useGetOrderValueByLocationQuery } from "@/components/store/api/report/reportApi";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function OrderValueByLocation() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch order value by location dynamically
  const { data: orderValueData, isLoading } = useGetOrderValueByLocationQuery({
    days: timeRange,
  });

  console.log(orderValueData);

  // Extract dynamic labels (locations) and data (order values)
  const labels = orderValueData?.data?.map((item) => item.location) || [];
  const dataValues = orderValueData?.data?.map((item) => item.totalValue) || [];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Order Value (BDT)",
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
          label: (context: TooltipItem<"bar">) => {
            const value = context.raw as number; // Explicitly cast raw to number
            return `${value.toLocaleString()} BDT`; // Display value with "BDT" label
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
          text: "Order Value (BDT)",
          color: "#6B7280",
          font: { size: 12 },
        },
        ticks: {
          callback: function (tickValue: string | number) {
            if (typeof tickValue === "number") {
              return tickValue.toLocaleString(); // Format number with commas
            }
            return tickValue; // If tickValue is a string, return as is
          },
        },
      },
    },
  };

  // Calculate total sales value dynamically
  const totalSalesValue = dataValues.reduce((sum, value) => sum + value, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Order Value By Location</h2>
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

      {/* Total Sales Value */}
      <div className="flex justify-between text-sm font-semibold mt-4">
        <div>Total Sales Value: {totalSalesValue.toLocaleString()} BDT</div>
      </div>
    </div>
  );
}
