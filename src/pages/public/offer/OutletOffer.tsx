import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const OutletOffer = ({ data }: any) => {
  const [countdown, setCountdown] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data?.expiryDate && data?.expiryTime) {
        const expiryDateTime = new Date(
          `${data?.expiryDate} ${data?.expiryTime}`
        );
        const now = new Date();

        // Calculate the remaining time
        const remainingTime = expiryDateTime.getTime() - now.getTime();
        if (remainingTime <= 0) {
          clearInterval(interval);
          setCountdown(null);
        } else {
          const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

          setCountdown({ days, hours, minutes, seconds });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link to={"/latest-offer"}>
            {" "}
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <span className="cursor-pointer">&larr; Offer Details</span>
            </div>
          </Link>

          {/* Countdown Timer */}
          <div className="flex items-center gap-3 mt-8 p-2 bg-yellow-100 rounded-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {countdown ? "Offer Ends In:" : "Offer Expired"}
            </h3>
            {countdown ? (
              <div className="flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                    {countdown.days}
                  </div>
                  <span className="text-sm text-gray-600">Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                    {countdown.hours}
                  </div>
                  <span className="text-sm text-gray-600">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                    {countdown.minutes}
                  </div>
                  <span className="text-sm text-gray-600">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                    {countdown.seconds}
                  </div>
                  <span className="text-sm text-gray-600">Seconds</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 mt-2">This offer has expired.</div>
            )}
          </div>
        </div>

        {/* Offer Image */}
        <div className="mt-4">
          <img
            src={data?.image}
            alt={data?.offerName}
            className="w-full rounded-lg"
          />
        </div>

        {/* Offer Details */}
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {data?.offerName}
          </h2>
          <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>
                {data?.startingDate} - {data?.expiryDate}
              </span>
            </div>
            {data?.offerType === "Outlet" && (
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>All Outlets</span>
              </div>
            )}
          </div>

          {/* Offer Subtitle */}
          {data?.subTitle && (
            <p className="text-gray-600 mt-3">{data?.subTitle}</p>
          )}

          {/* Discount Tag */}
          {data?.discount && (
            <div className="mt-3">
              <span className="text-lg font-bold text-red-600 bg-red-100 px-3 py-1 rounded-md">
                {data?.discount}% OFF
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletOffer;
