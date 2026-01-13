import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useGetOrderSourceReportQuery } from "@/components/store/api/report/reportApi";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrderSource() {
  const [timeRange, setTimeRange] = useState("30"); 

  // Fetch data from API
  const { data: orderSource, isLoading } = useGetOrderSourceReportQuery({
    days: timeRange
  });


  // Extract labels and counts dynamically
  const labels = orderSource?.data?.map((item) => item.source) || [];
  const counts = orderSource?.data?.map((item) => item.count) || [];

  // Total Order Count
  const totalOrders = orderSource?.totalOrders || 0;

  const data = {
    labels: labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          "#3490dc", // Blue
          "#f0ad4e", // Yellow
          "#6c757d", // Gray
          "#fd7e14", // Orange
          "#4ade80", // Green
          "#8b5cf6", // Purple
          "#fbbf24", // Amber
          "#3b82f6", // Indigo
        ],
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
            return `${context.raw} Orders`; // Display order count in tooltip
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
    <div className="p-3 bg-white rounded-lg shadow-md lg:h-[450px]">
      <h2 className="text-lg font-semibold">Order Source</h2>

      {/* Dropdowns for filtering */}
      <div className="flex justify-between items-center mt-3">
        {/* <select
          className="px-2 py-1 border rounded-md text-sm"
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select> */}

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

      {/* Show Loader while fetching */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500 ">Loading...</div>
      ) : (
        <div className="lg:h-[330px] flex justify-center">

          <Doughnut data={data} options={options} />
        </div>
      )}

      <div className="text-xs text-gray-500 text-center mt-2">
        <span className="font-semibold">Total Order</span> -{totalOrders}
      </div>
    </div>
  );
}
