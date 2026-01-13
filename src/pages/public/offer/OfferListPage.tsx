import { FaCalendarAlt, FaGlobe, FaSadTear } from "react-icons/fa";
import { useGetAllOffersQuery } from "@/components/store/api/products/offerApi";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RxHome } from "react-icons/rx";
import { timeDateFormatter } from "@/utils/helper/timeDateFormatter";

const OfferListPage = () => {
  const { data: offers, isLoading: offerLoading } = useGetAllOffersQuery({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (offerLoading) {
    return (
      <div className="flex flex-wrap items-center gap-5 mx-5 container my-16 w-full h-full">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    );
  }

  // Filter offers to only include those with both startingDate and expiryDate
  const validOffers = offers?.data?.filter(
    (offer) => offer.startingDate || offer.expiryDate
  );

  return (
    <div className="container mx-auto min-h-screen px-4 pb-10">
      <div className="my-5 p-4 flex items-center justify-between rounded-md shadow-md">
        <p>
          <Link to={"/latest-offer"}>
            <span>Offer</span>
          </Link>{" "}
          /{" "}
          <Link to={"/"}>
            <span>Home</span>
          </Link>
        </p>
      </div>

      {validOffers?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {validOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={offer.image}
                  alt={offer.offerName}
                  className="w-full h-96 p-3 object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="flex border-b pb-3 items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span className="text-[14px]">
                      {offer.startingDate
                        ? timeDateFormatter(offer.startingDate)
                        : ""}{" "}
                      - {timeDateFormatter(offer.expiryDate)}
                    </span>
                  </div>

                  {offer?.offerType === "Online" ? (
                    <>
                      <div className="flex text-gray-600 items-center gap-2 text-[10px]">
                        <FaGlobe size={15} />
                        <span className="text-base">Online</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex text-gray-600 items-center gap-2 text-[10px]">
                        <RxHome size={16} />
                        <span className="text-base">Outlet</span>
                      </div>
                    </>
                  )}
                </div>

                <h2 className="text-xl text-center font-bold text-gray-800 mt-2">
                  {offer.offerName}
                </h2>

                {offer.subTitle && (
                  <p className="text-gray-600 text-center text-sm my-3">
                    {offer.subTitle}
                  </p>
                )}

                {/* View Details Button */}
                <Link to={`/latest-offer/${offer?.link}`}>
                  <div className="mt-5 text-center">
                    <p className="block bg-blue-600 text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition duration-300">
                      View Details
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-blue-50 p-8 rounded-full mb-6">
            <FaSadTear className="text-blue-400 text-6xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No Offers Available
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            We couldn't find any active offers right now. Check back soon for
            exciting deals!
          </p>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <RxHome />
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default OfferListPage;
