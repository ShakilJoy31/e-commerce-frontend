
import { Link } from "react-router-dom";
import DiscountTimer from "../productDetailsComponent/DiscountTimer";

const AppleShoppingEvent = ({offerData}) => {

  console.log(offerData)
  // Check if we have valid dates before rendering
  const hasValidDates =
    offerData?.[0]?.offer?.startingDate ||
    offerData?.[0]?.offer?.expiryDate;

  const offeredId = offerData?.[0]?.offer?.id;

  // Don't render anything if we don't have valid dates
  if (!hasValidDates) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-pink-100 to-blue-100 p-8 rounded-lg shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-3">
        <div>
          <img
            src={offerData?.[0]?.offer?.image}
            alt={offerData?.[0]?.offer?.offerName}
            className="w-11/12 h-full object-cover mx-auto"
          />
        </div>
        <div className="text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary italic">
            {offerData?.[0]?.offer?.offerName}
          </h2>
          <p className="text-gray-700 mt-2">
            {offerData?.[0]?.offer?.discount > 0 ? (
              <>
                Hurry and get discounts up to{" "}
                <span className="text-2xl lg:text-4xl font-semibold text-red-600 animate-pulse">
                  {offerData?.[0]?.offer?.discount}{" "}
                  {offerData?.[0]?.offer?.discountType === "PERCENTAGE"
                    ? "%"
                    : "৳"}
                </span>
              </>
            ) : (
              "Special offers available - don't miss out!"
            )}
          </p>
          <div className="flex justify-center lg:justify-start mt-4 space-x-2">
            <DiscountTimer
              data={{
                startDate: offerData?.[0]?.offer?.startingDate,
                endDate: offerData?.[0]?.offer?.expiryDate,
                preDiscountPrice: offerData?.[0]?.offer?.preDiscountPrice,
                discountPrice: offerData?.[0]?.offer?.discount,
              }}
            />
          </div>
          {offeredId && (
            <Link to={`/latest-offer`}>
              <button className="my-4 lg:mt-4 bg-blue-600 text-white px-3 lg:px-6 py-1 lg:py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                Go for Shopping
              </button>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {offerData?.slice(0, 6)?.map((offer: any) => (
            <>
              <Link to={`/products/${offer?.product?.productLink}`}>
                <div
                  key={offer?.product?.id}
                  className="bg-white h-40 p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-center"
                >
                  <img
                    src={offer?.product?.ProductImage?.[0]?.imageUrl}
                    alt={offer?.product?.productName}
                    className="h-16 mb-2"
                  />
                  <h3 className="text-sm font-medium">
                    {offer?.product?.productName}
                  </h3>
                  <div className="flex justify-center mt-1">
                    {"⭐".repeat(offer?.product?.rating || 0)}
                  </div>
                </div>
              </Link>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppleShoppingEvent;
