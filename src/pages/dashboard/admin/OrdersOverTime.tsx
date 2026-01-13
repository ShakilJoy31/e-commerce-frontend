import { useState } from "react";
import { Line } from "react-chartjs-2";
import { useGetOrderOverTimeQuery } from "@/components/store/api/report/reportApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function OrdersOverTime() {
  const [selectedRange, setSelectedRange] = useState("Last 24 Hours");

  // Fetch dynamic data from API
  const getFormattedDate = (daysAgo = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0]; 
  };
  
  const { data: orderOverTimes, isLoading } = useGetOrderOverTimeQuery({
    day1: getFormattedDate(0), 
    day2: getFormattedDate(1), 
  });


  // Extract date labels from API response
  const day1Label = orderOverTimes?.date1 || "Date 1";
  const day2Label = orderOverTimes?.date2 || "Date 2";

  // Extract hourly data for both dates
  const hours = orderOverTimes?.data?.map((entry) => `${entry.hour}:00`) || [];
  const date1Counts = orderOverTimes?.data?.map((entry) => entry.date1Count) || [];
  const date2Counts = orderOverTimes?.data?.map((entry) => entry.date2Count) || [];

  // Define chart data dynamically
  const data = {
    labels: hours,
    datasets: [
      {
        label: day1Label,
        data: date1Counts,
        borderColor: "#cbd5e1", // Tailwind Gray 300
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: day2Label,
        data: date2Counts,
        borderColor: "#3b82f6", // Tailwind Blue 500
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

  // Define chart options
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#6b7280", // Tailwind Gray 500
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280", // Tailwind Gray 500
        },
        grid: {
          color: "#e5e7eb", // Tailwind Gray 200
        },
      },
      y: {
        ticks: {
          color: "#6b7280", // Tailwind Gray 500
        },
        grid: {
          color: "#e5e7eb", // Tailwind Gray 200
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md ">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 ">
        <h3 className="text-lg font-semibold">Orders Over Time</h3>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="text-sm text-gray-600 flex items-center">
              {selectedRange}
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuItem onClick={() => setSelectedRange("Last 12 Hours")}>
              Last 12 Hours
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRange("Last Day")}>
              Last Day
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRange("Week")}>
              Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRange("Month")}>
              Month
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {date1Counts.reduce((acc, count) => acc + count, 0)}
          </h2>
          <p className="text-sm text-gray-500 mb-3">Total Orders on {day1Label}</p>
          <div className="lg:h-[290px] w-full">
            <Line  data={data} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
