import { useGetOfferByIdQuery } from "@/components/store/api/products/offerApi";
import { useParams } from "react-router-dom";
import OfferDescription from "./OfferDescription";
import OutletOffer from "./OutletOffer";
import OnlineOffer from "./OnlineOffer";
import { useEffect } from "react";
import Heading from "@/components/typography/Heading";

const OfferDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: singleOffer, isLoading: offerLoading } =
    useGetOfferByIdQuery(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (offerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4">
      <Heading
        variant="primary"
        className="mb-6 text-xl lg:text-3xl my-10 text-center relative after:absolute after:content-normal after:w-40 after:h-1 after:bg-primary after:left-0 after:right-0 after:mx-auto after:-bottom-3"
        align="center"
      >
        {singleOffer?.data?.offerName}
      </Heading>
      <div className="my-10 max-w-4xl mx-auto">
        <OfferDescription
          details={singleOffer?.data?.description}
          condition={singleOffer?.data?.condition}
        />
      </div>
      {singleOffer?.data?.offerType === "Outlet" && (
        <OutletOffer data={singleOffer?.data} />
      )}
      {singleOffer?.data?.offerType === "Online" && (
        <OnlineOffer singleData={singleOffer} />
      )}
    </div>
  );
};

export default OfferDetails;
