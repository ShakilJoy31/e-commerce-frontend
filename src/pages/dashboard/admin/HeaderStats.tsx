import { useEffect, useState } from "react";
import { useGetDashboardStatisticsQuery } from "@/components/store/api/report/reportApi";
import { Box } from "lucide-react";
import { BsCart3 } from "react-icons/bs";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

// Function to estimate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (!previous || previous === 0) return "0%"; // Avoid division by zero
  const change = ((current - previous) / previous) * 100;
  return `${change.toFixed(1)}% ${change >= 0 ? "Inc" : "Dec"}`;
};

export default function OrderStats() {
  const { data: reports, isLoading } = useGetDashboardStatisticsQuery({});
  const [previousStats, setPreviousStats] = useState<any>(null);

  // Load previous stats from local storage when component mounts
  useEffect(() => {
    const storedStats = localStorage.getItem("previousStats");
    if (storedStats) {
      setPreviousStats(JSON.parse(storedStats));
    }
  }, []);

  // Update local storage when new reports data arrives
  useEffect(() => {
    if (reports) {
      localStorage.setItem("previousStats", JSON.stringify(reports));
    }
  }, [reports]);

  // If data is not available yet, show a loading message
  if (isLoading || !reports) {
    return (
      <div className="col-span-full text-center text-lg font-semibold">
        Loading stats...
      </div>
    );
  }

  // Ensure previousStats is available before calculating percentages
  const stats = previousStats
    ? [
        {
          value: `BDT ${reports.totalRevenue.toLocaleString()}`,
          label: "Total Revenue",
          icon: <FaBangladeshiTakaSign />,
          percentage: calculatePercentageChange(
            reports.totalRevenue,
            previousStats.totalRevenue
          ),
        },
         {
          value: reports.pendingCount,
          label: "Pending Order",
          icon: <BsCart3 />,
          percentage: calculatePercentageChange(
            reports.pendingCount,
            previousStats.pendingCount
          ),
        },
        {
          value: reports.confirmCount,
          label: "Confirm Order",
          icon: <BsCart3 />,
          percentage: calculatePercentageChange(
            reports.confirmCount,
            previousStats.confirmCount
          ),
        },
         {
          value: reports.onHoldCount,
          label: "On Hold Order",
          icon: <BsCart3 />,
          percentage: calculatePercentageChange(
            reports.onHoldCount,
            previousStats.onHoldCount
          ),
        },
         {
          value: reports.canceledOrderCount,
          label: "Cancel Order",
          icon: <Box />,
          percentage: calculatePercentageChange(
            reports.canceledOrderCount,
            previousStats.canceledOrderCount
          ),
        },
        {
          value: reports.processingCount,
          label: "Processing Order",
          icon: <BsCart3 />,
          percentage: calculatePercentageChange(
            reports.processingCount,
            previousStats.processingCount
          ),
        },
        
        {
          value: reports.shippedCount,
          label: "Shipped Order",
          icon: <Box />,
          percentage: calculatePercentageChange(
            reports.shippedCount,
            previousStats.shippedCount
          ),
        },
       
        {
          value: reports.inDeliveryCount,
          label: "In Delivery Order",
          icon: <Box />,
          percentage: calculatePercentageChange(
            reports.inDeliveryCount,
            previousStats.inDeliveryCount
          ),
        },
        {
          value: reports.deliveryOrderCount,
          label: "Delivery Order",
          icon: <Box />,
          percentage: calculatePercentageChange(
            reports.deliveryOrderCount,
            previousStats.deliveryOrderCount
          ),
        },

       
       
        {
          value: reports.completeOrderCount,
          label: "Completed Order",
          icon: <Box />,
          percentage: calculatePercentageChange(
            reports.completeOrderCount,
            previousStats.completeOrderCount
          ),
        },
        // {
        //   value: reports.returnProductCount,
        //   label: "Return Product",
        //   icon: <Box />,
        //   percentage: calculatePercentageChange(
        //     reports.returnProductCount,
        //     previousStats.returnProductCount
        //   ),
        // },
        // {
        //   value: reports.damageProductCount,
        //   label: "Damage Product",
        //   icon: <Box />,
        //   percentage: calculatePercentageChange(
        //     reports.damageProductCount,
        //     previousStats.damageProductCount
        //   ),
        // },
        // {
        //   value: `BDT ${reports.shippedTotal.toLocaleString()}`,
        //   label: "Shipped",
        //   icon: <BsCart3 />,
        //   percentage: calculatePercentageChange(
        //     reports.shippedTotal,
        //     previousStats.shippedTotal
        //   ),
        // },
        // {
        //   value: `BDT ${reports.deliveryPaymentCollect.toLocaleString()}`,
        //   label: "Delivery Payment Collect",
        //   icon: <FaBangladeshiTakaSign />,
        //   percentage: calculatePercentageChange(
        //     reports.deliveryPaymentCollect,
        //     previousStats.deliveryPaymentCollect
        //   ),
        // },
        // {
        //   value: `BDT ${reports.deliveryPaymentDue.toLocaleString()}`,
        //   label: "Delivery Payment Due",
        //   icon: <FaBangladeshiTakaSign />,
        //   percentage: calculatePercentageChange(
        //     reports.deliveryPaymentDue,
        //     previousStats.deliveryPaymentDue
        //   ),
        // },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg p-4 hover:scale-105 transition-transform duration-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-gray-500">
                {stat.label}
              </h3>
              <div className="text-xl font-bold text-black">{stat.value}</div>
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm ${
                    stat.percentage.includes("Inc")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.percentage}
                </span>
              </div>
            </div>
            <div className="text-lg font-semibold text-blue-500 bg-slate-300 rounded-full p-2">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
