import { FaLocationDot, FaTruck } from "react-icons/fa6";
import { MdFlashOn } from "react-icons/md";
import { Link } from "react-router-dom";
const PublicHeaderBottom = () => {
  return (
    <div className="bg-white shadow-md lg:block hidden">
      <div className="max-w-[1650px] px-3 py-2.5 mx-auto items-center flex justify-between">
        <div className="flex items-center gap-2">
          <MdFlashOn className="text-[#0112EE] text-base" />
          <p className="uppercase text-base font-semibold text-[#0112EE]">
            Search Trending:
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={"/track-order"}
            className="flex gap-2 items-center text-[13px] font-bold"
          >
            <FaTruck  className="text-xl text-[#2835D1]" />
            <p className="text-base font-semibold text-[#2835D1]">
              Track Your Order{" "}
            </p>
          </Link>
          <Link
            to={"/our-branches"}
            className="flex gap-1 items-center text-[13px] font-bold"
          >
            <FaLocationDot  className="text-xl text-[#2835D1]" />
            <p className="text-base font-semibold text-[#2835D1]">
              Store Location
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicHeaderBottom;
