import { cn } from "@/lib/utils";

import PublicHeader from "@/components/common/shared/PublicHeader";
import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import WeChatWhatsApp from "@/utils/common/WechatWhatsApp";
import Footer from "@/components/common/shared/Footer";
import BottomNav from "@/components/common/shared/BottomNav";
import MobileNav from "@/components/common/shared/MobileNav";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import DOMPurify from "dompurify";
import { useGetNavbarDataQuery } from "@/components/store/api/user/userApi";

const PublicLayout: FC = () => {
   const {data, isLoading}=useGetNavbarDataQuery({})
   const isMaintenance = data?.data?.companyInfo?.[0]?.isMaintenance;
  const maintenanceStartDate = data?.data?.companyInfo?.[0]?.maintenanceStartDate;
  const maintenanceEndDate = data?.data?.companyInfo?.[0]?.maintenanceEndDate;
  const user = useSelector(selectUser);
  const sanitizedDescription = DOMPurify.sanitize(
    data?.data?.companyInfo?.[0]?.maintenanceContent
  );

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: "Calculating...",
    localStartTime: "",
    localEndTime: "",
  });
  

  useEffect(() => {
  if (isMaintenance && maintenanceStartDate && maintenanceEndDate) {
    const startUTC = new Date(maintenanceStartDate); // keep them in UTC
    const endUTC   = new Date(maintenanceEndDate);

    const formatDhaka = (date: Date) =>
      date.toLocaleString('en-US', {          // 'en-BD' isn’t a valid locale; use 'en-US' or 'bn-BD'
        year:   'numeric',
        month:  'numeric',
        day:    'numeric',
        hour:   '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Dhaka',
      });

    const calculateTimeLeft = () => {
      const nowUTC = new Date();

      // maintenance not started yet
      if (nowUTC < startUTC) {
        const diff = startUTC.getTime() - nowUTC.getTime();
        return {
          days:    Math.floor(diff / 8.64e7),
          hours:   Math.floor(diff / 3.6e6 ) % 24,
          minutes: Math.floor(diff / 6e4   ) % 60,
          seconds: Math.floor(diff / 1e3   ) % 60,
          status:  'Maintenance starts in',
          localStartTime: formatDhaka(startUTC),
          localEndTime:   formatDhaka(endUTC),
        };
      }

      // maintenance in progress
      if (nowUTC >= startUTC && nowUTC <= endUTC) {
        const diff = endUTC.getTime() - nowUTC.getTime();
        return {
          days:    Math.floor(diff / 8.64e7),
          hours:   Math.floor(diff / 3.6e6 ) % 24,
          minutes: Math.floor(diff / 6e4   ) % 60,
          seconds: Math.floor(diff / 1e3   ) % 60,
          status:  'Maintenance ends in',
          localStartTime: formatDhaka(startUTC),
          localEndTime:   formatDhaka(endUTC),
        };
      }

      // maintenance finished
      return {
        days: 0, hours: 0, minutes: 0, seconds: 0,
        status: 'Maintenance completed',
        localStartTime: formatDhaka(startUTC),
        localEndTime:   formatDhaka(endUTC),
      };
    };

    // update immediately, then every second
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);

    return () => clearInterval(timer);
  }
}, [isMaintenance, maintenanceStartDate, maintenanceEndDate]);


  const filteredContent = sanitizedDescription
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-2">')
    .replace(/<\/h1>/g, "</h1>")
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-2">')
    .replace(/<\/h2>/g, "</h2>")
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2">')
    .replace(/<\/h3>/g, "</h3>")
    .replace(/<h4>/g, '<h4 class="text-base font-semibold mb-2">')
    .replace(/<\/h4>/g, "</h4>")
    .replace(/<p>/g, '<p class="mb-4 text-base leading-relaxed">')
    .replace(/<\/p>/g, "</p>")
    .replace(/<ul>/g, '<ul class="list-disc pl-5">')
    .replace(/<\/ul>/g, "</ul>")
    .replace(/<ol>/g, '<ol class="list-decimal pl-5">')
    .replace(/<\/ol>/g, "</ol>");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  if (isMaintenance && (!user?.role || user?.role.toLowerCase() === "user")) {
    return (
      <div className="mx-auto max-w-6xl px-5 min-h-screen p-4 flex flex-col">
        {/* Timer Display */}
       {(maintenanceStartDate && maintenanceEndDate) && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow border border-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
              {timeLeft.status}
            </h2>
            <div className="flex justify-center gap-2 lg:gap-6">
              <div className="text-center bg-white p-1.5 lg:p-3 rounded-lg shadow-sm min-w-14 lg:min-w-[70px]">
                <div className="text-xl lg:text-3xl font-bold text-blue-600">{timeLeft.days}</div>
                <div className="text-xs lg:text-sm text-gray-600">Days</div>
              </div>
              <div className="text-center bg-white p-1.5 lg:p-3 rounded-lg shadow-sm min-w-14 lg:min-w-[70px]">
                <div className="text-xl lg:text-3xl font-bold text-blue-600">{timeLeft.hours}</div>
                <div className="text-xs lg:text-sm text-gray-600">Hours</div>
              </div>
              <div className="text-center bg-white p-1.5 lg:p-3 rounded-lg shadow-sm min-w-14 lg:min-w-[70px]">
                <div className="text-xl lg:text-3xl font-bold text-blue-600">{timeLeft.minutes}</div>
                <div className="text-xs lg:text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center bg-white p-1.5 lg:p-3 rounded-lg shadow-sm min-w-14 lg:min-w-[70px]">
                <div className="text-xl lg:text-3xl font-bold text-blue-600">{timeLeft.seconds}</div>
                <div className="text-xs lg:text-sm text-gray-600">Seconds</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              {timeLeft.status === 'Maintenance starts in' ? (
                <p>Scheduled from {timeLeft.localStartTime} to {timeLeft.localEndTime} (Bangladesh Time)</p>
              ) : timeLeft.status === 'Maintenance ends in' ? (
                <p>Ongoing until {timeLeft.localEndTime} (Bangladesh Time)</p>
              ) : (
                <p>Maintenance was completed on {timeLeft.localEndTime} (Bangladesh Time)</p>
              )}
            </div>
          </div>
        )}

        <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none flex-grow">
          <div
            dangerouslySetInnerHTML={{ __html: filteredContent }}
            className="w-full [&_img]:w-full [&_img]:h-auto "
          />
        </div>
      </div>
    );
  }

  return (
    <main className={cn("bg-background text-foreground")}>
      {/* <PublicNavigationTop /> */}

      <PublicHeader data={data} isLoading={isLoading}/>
      <MobileNav data={data} isLoading={isLoading}/>

      <div className="block lg:hidden">
        <BottomNav />
      </div>
      {/* <PublicHeaderBottom/> */}

      <section className="">
        <Outlet />
      </section>

      <div>
        <Footer data={data} isLoading={isLoading}/>
      </div>
      <div className="hidden lg:block">
        <WeChatWhatsApp />
      </div>
    </main>
  );
};

export default PublicLayout;
