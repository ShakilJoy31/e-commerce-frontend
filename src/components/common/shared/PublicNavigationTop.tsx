import ButtonLoader from "@/components/loader/ButtonLoader";
import Marquee from "react-fast-marquee";
export default function PublicNavigationTop({banner, bannerLoading}) {


  // Get the hotline number dynamically
  const hotlineNumber = banner?.data[0]?.phone || "";

  return (
    <div>
      {
        banner?.data[0]?.isMarqueeShow ? (
          <div className="bg-white text-primary">
      <div className="max-w-[1650px] mx-auto px-6 py-1 flex items-center">
        {/* Left Section - Welcome Message (Hidden on Mobile) */}

        <div className="pr-10">
          <Marquee
            direction="left"
            autoFill={false} // Prevents automatic repetition
            pauseOnClick={true}
            pauseOnHover={true}
            speed={40} // Adjust speed to match text length
            
            loop={0} // Infinite looping
          >
            <p className="text-[12px] lg:text-[14px] font-medium leading-[20px] hidden lg:block">
              {banner?.data[0]?.marqueeText}
            </p>
          </Marquee>
        </div>

        {/* Right Section - Hotline Number (Always Right Aligned) */}
        <a href={`tel:+88${hotlineNumber}`}>
          <div className="text-[12px] flex items-center gap-1 lg:text-[14px] font-semibold ml-auto text-right">
            Hotline:{" "}
            <span className="tracking-widest">
              {bannerLoading ? <ButtonLoader /> : hotlineNumber}
            </span>
          </div>
        </a>
      </div>
    </div>
        ): null
      }
    </div>
  );
}
