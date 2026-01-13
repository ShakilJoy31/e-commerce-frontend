import { useEffect, useState } from "react";

const DiscountTimer = ({ data }: any) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: "Calculating...",
    targetTime: "",
  });

  const [lastStatus, setLastStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.startDate && !data?.endDate) return;

    const checkDiscountStatus = () => {
      const now = new Date();
      const startDate = data.startDate ? new Date(data.startDate) : null;
      const endDate = data.endDate ? new Date(data.endDate) : null;

      let targetDate: Date | null = null;
      let status = "";

      if (startDate && now < startDate) {
        // Before discount starts
        targetDate = startDate;
        status = "Discount Starts In";
      } else if (endDate && now < endDate) {
        // During discount
        targetDate = endDate;
        status = "Discount Ends In";
      } else {
        // Discount over
        return { shouldReload: true };
      }

      const diff = targetDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const targetTime = targetDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Dhaka",
      });

      return {
        timeData: {
          days,
          hours,
          minutes,
          seconds,
          status,
          targetTime,
        },
        shouldReload: false,
      };
    };

    const timer = setInterval(() => {
      const result = checkDiscountStatus();

      if (result.shouldReload) {
        clearInterval(timer);
        window.location.reload();
        return;
      }

      if (result.timeData) {
        // Check if status changed (discount started)
        if (
          lastStatus === "Discount Starts In" &&
          result.timeData.status === "Discount Ends In"
        ) {
          clearInterval(timer);
          window.location.reload();
          return;
        }

        setTimeLeft(result.timeData);
        setLastStatus(result.timeData.status);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.startDate, data?.endDate, lastStatus]);

  if (!data?.startDate && !data?.endDate) return null;

  return (
    <div className="mb-3 p-2 bg-blue-50 rounded-lg shadow border border-blue-100">
      <h2 className="text-lg font-bold mb-2 text-center text-blue-800">
        {data?.preDiscountPrice > 0 || data?.discountPrice > 0
          ? `${data?.preDiscountPrice || data?.discountPrice} Tk`
          : ""}{" "}
       {timeLeft.status}
      </h2>

      <div className="flex justify-center gap-3">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div
            key={unit}
            className="text-center bg-white p-1.5 rounded-lg shadow-sm min-w-14"
          >
            <div className="text-xl font-bold text-blue-600">
              {timeLeft[unit as keyof typeof timeLeft]}
            </div>
            <div className="text-xs lg:text-sm text-gray-600">
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {timeLeft.targetTime && (
        <div className="mt-2 text-center text-sm text-gray-500">
          {timeLeft.status.includes("starts")
            ? `Starts at ${timeLeft.targetTime}`
            : `Ends at ${timeLeft.targetTime}`}
        </div>
      )}
    </div>
  );
};

export default DiscountTimer;
