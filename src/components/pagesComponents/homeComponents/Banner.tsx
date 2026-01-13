import { Autoplay, Navigation } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import BannerSkeleton from "@/components/common/skeleton/BannerSkeleton";
import { useRef } from "react";

export default function Banner({sliders, isLoading}) {
  // Create refs for the next and previous buttons
  const prevRefBanner = useRef(null);
  const nextRefBanner = useRef(null);

  return (
    <div className="group col-span-3 px-0 md:px-5">
      <Swiper
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
        }}
        navigation={{
          prevEl: prevRefBanner.current,
          nextEl: nextRefBanner.current,
        }}
        loop={true}
        modules={[Navigation, Autoplay]}
        className="mx-auto w-[100%] swiper-scale-effect"
        speed={1000}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
      >
        {isLoading ? (
          <>
            <BannerSkeleton />
          </>
        ) : sliders?.length > 0 ? (
          sliders.map((slider: any) => (
            <SwiperSlide className="bg-[#EEEEEE] swiper-slide" key={slider.id}>
              <div className="relative text-white swiper-slide-cover h-auto">
                <Link to={`${slider?.link}`}>
                  <img
                    src={slider.image}
                    alt={slider.title || "Banner image"}
                    className="w-full h-40 md:h-auto lg:object-cover"
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No banners available</p>
          </SwiperSlide>
        )}

        {/* Slider Navigation Buttons */}
        <button
          ref={prevRefBanner}
          className="prev-button absolute -translate-x-full group-hover:translate-x-1 -left-10 group-hover:left-0 md:group-hover:left-2 top-[40%] md:top-[45%]  z-50 mx-2 rounded-full bg-[#ffffff27] p-2 text-white duration-500 group-hover:bg-[#ffffffcb] group-hover:text-black"
          aria-label="Previous Slide"
        >
          <IoIosArrowBack className="text-xl md:text-2xl font-bold" />
        </button>
        <button
          ref={nextRefBanner}
          className="next-button absolute translate-x-full group-hover:-translate-x-1 -right-10 group-hover:right-0 md:group-hover:right-2 top-[40%] md:top-[45%]  z-50 mx-2 rounded-full bg-[#ffffff27] p-2 text-white duration-500 group-hover:bg-[#ffffffcb] group-hover:text-black"
          aria-label="Next Slide"
        >
          <IoIosArrowForward className="text-xl md:text-2xl font-bold" />
        </button>
      </Swiper>
    </div>
  );
}
