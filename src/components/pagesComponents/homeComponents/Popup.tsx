
import { extractAltText } from "@/utils/helper/extractAltText";
import { useState, useEffect } from "react";
import { LuX } from "react-icons/lu";

const Popup = ({offerData}) => {
  const [showPopup, setShowPopup] = useState(true);
  
  const activeOffer = offerData?.find((offer: any) => offer.active === true);

  // Check if user previously closed the popup
  useEffect(() => {
    const popupClosed = sessionStorage.getItem("popupClosed");
    if (popupClosed === "true") {
      setShowPopup(false);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    sessionStorage.setItem("popupClosed", "true");
  };


  if (!showPopup || !activeOffer) return null;

  return (
    <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-11/12 lg:w-3/5 relative h-auto">
        {/* Offer Image */}
        <img
          src={activeOffer.image}
          alt={extractAltText(activeOffer?.image)}
          className="object-cover w-full h-auto lg:h-[70vh] mx-auto rounded-lg shadow-lg"
        />
        {/* Close Button (Top-Right Corner of Image) */}
        <button onClick={handleClose} className="absolute top-2 right-2">
          <LuX className="text-2xl text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Popup;
