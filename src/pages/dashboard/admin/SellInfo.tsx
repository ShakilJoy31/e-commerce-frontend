import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { useGetSellInformationQuery } from "@/components/store/api/report/reportApi";

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function SellInformation() {
  const [timeRange, setTimeRange] = useState("30");

  // Fetch dynamic sell information data
  const { data: sellInfo, isLoading } = useGetSellInformationQuery({
    days: timeRange,
  });


  // Define chart labels from API keys
  const labels = [
    "Pending",
    "On Hold",
    "Approved",
    "Processing",
    "Delivered",
    "Shipped",
    "Cancelled",
  ];

  // Map API response to dataset values
  const datasetData = [
    parseFloat(sellInfo?.data?.PENDING || "0"),
    parseFloat(sellInfo?.data?.HOLD || "0"),
    parseFloat(sellInfo?.data?.APPROVED || "0"),
    parseFloat(sellInfo?.data?.PROCESSING || "0"),
    parseFloat(sellInfo?.data?.DELIVERED || "0"),
    parseFloat(sellInfo?.data?.SHIPPED || "0"),
    parseFloat(sellInfo?.data?.CANCELLED || "0"),
  ];

  // Define chart data dynamically
  const chartData = {
    labels,
    datasets: [
      {
        data: datasetData,
        backgroundColor: [
          "#3490dc", // Blue - Pending
          "#f0ad4e", // Yellow - On Hold
          "#28a745", // Green - Approved
          "#6c757d", // Gray - Processing
          "#fd7e14", // Orange - Delivered
          "#dc3545", // Red - Shipped
          "#17a2b8", // Cyan - Cancelled
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md lg:h-[350px]">
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-lg font-bold">Sell Information</h2>
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

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : (
        <div className="flex">
          {/* Labels Section */}
          <div className="w-1/3">
            <div className="space-y-2">
              {labels.map((label, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-4 h-4 mr-2"
                    style={{
                      backgroundColor: chartData.datasets[0].backgroundColor[index],
                    }}
                  ></div>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="w-2/3 lg:h-[250px]">
            <Pie data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
