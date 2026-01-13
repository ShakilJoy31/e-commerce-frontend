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
import { useGetOrderValueBySourceQuery } from "@/components/store/api/report/reportApi";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function OrderValueBySource() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch data from API
  const { data: orderValueBySource, isLoading } = useGetOrderValueBySourceQuery({
    days: timeRange,
  });

  console.log(orderValueBySource);

  // Extracting labels, total values, and order counts dynamically
  const labels = orderValueBySource?.data?.map((item) => item.source) || [];
  const totalValues = orderValueBySource?.data?.map((item) => item.totalValue) || [];

  // Chart Data
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Order Value (BDT)",
        data: totalValues,
        backgroundColor: "#3B82F6", // Blue bars for each source
        borderRadius: 5,
        hoverBackgroundColor: "#2563EB", // Darker blue on hover
      },
    ],
  };

  // Chart Options
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${value.toLocaleString()} BDT`; // Display value in BDT format
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Order Source",
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
              return tickValue.toLocaleString();
            }
            return tickValue;
          },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Order Value By Source</h2>
        <div className="flex gap-3">
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

      {/* Show Loader while fetching */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="mb-4">
            <Bar data={data} options={options} />
          </div>

          {/* Total Order Count and Total Value */}
          <div className="flex justify-between text-sm font-semibold">
            <div>Total Order Count: {orderValueBySource?.totalOrderCount || 0}</div>
            <div>Total Value: {orderValueBySource?.totalValue?.toLocaleString()} BDT</div>
          </div>
        </>
      )}
    </div>
  );
}
