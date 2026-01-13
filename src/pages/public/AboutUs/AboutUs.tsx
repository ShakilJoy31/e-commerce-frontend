import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { MdArrowForwardIos } from "react-icons/md";
import bannerbg from "../../../assets/images/icon/otherbg.png";
export default function AboutUs() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="bg-cover bg-center py-16"
        style={{
          backgroundImage: `url(${bannerbg})`,
        }}
      >
        <SectionWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center ">ABOUT US</h2>
          <h2 className="text-[14px] font-medium flex items-center">
            Home{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            About Us
          </h2>
        </SectionWrapper>
      </div>

      {/* About Us Main Section */}
      <div className="p-4 max-w-4xl mx-auto">
        <div className="border rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-2xl font-bold mb-4">About Us</h2>

          <p className="mb-4">
            Welcome to <strong>KRY International</strong>, a name synonymous
            with trust, innovation, and excellence in the mobile and gadget
            industry of Bangladesh. Since our humble beginnings in 2011 as a
            small online venture, we have grown into one of the most
            recognizable brands, bringing cutting-edge technology and unmatched
            service to our customers.
          </p>

          <h3 className="text-xl font-semibold mb-2">Our Journey</h3>
          <p className="mb-4">
            Our journey began with a single dream by our visionary CEO, Kamrul
            Islam, whose dedication, hard work, and relentless pursuit of
            excellence have been the driving force behind our success. Under his
            leadership, KRY International opened its first physical store in
            2015 and expanded rapidly to serve customers nationwide. By 2017, we
            had established two more outlets, and in 2018, we reached another
            milestone by opening a store in Jamuna Future Park, one of the
            largest shopping malls in South Asia. That same year, KRY
            International took its first steps beyond Dhaka, reaching customers
            in other regions of the country.
          </p>

          <h3 className="text-xl font-semibold mb-2">A Story of Resilience</h3>
          <p className="mb-4">
            During the COVID-19 pandemic, when businesses faced unprecedented
            challenges, KRY International stood firm. Our CEO personally
            delivered products to customers, proving that our commitment to
            customer satisfaction goes beyond business—it’s a promise to care,
            even in the toughest times. This spirit of resilience and dedication
            has cemented KRY International’s reputation as a customer-centric
            brand.
          </p>

          <h3 className="text-xl font-semibold mb-2">Our Future Vision</h3>
          <p className="mb-4">
            KRY International’s journey is far from over. We aim to lead the
            gadget and IT sector by introducing innovative products, expanding
            our retail network, and enhancing customer experiences. With dreams
            of becoming a global player, we are constantly working to ensure
            that the latest technology is within reach for everyone.
          </p>

          <h3 className="text-xl font-semibold mb-2">
            Achievements and Recognition
          </h3>
          <p className="mb-4">
            KRY International is proud to have earned numerous accolades,
            including the Best Seller Award and Best Retailer Award in
            Bangladesh. These achievements reflect our commitment to excellence
            and our ability to adapt and thrive in a competitive market.
          </p>

          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="mb-4">
            To elevate the customer experience by providing the latest
            technology, unparalleled service, and value-driven solutions that
            meet the ever-evolving needs of our community.
          </p>

          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="mb-4">
            To become a global leader in the gadget and IT sector by empowering
            lives with innovative products, accessible technology, and
            exceptional service while fostering a deep connection with our
            customers.
          </p>

          <h3 className="text-xl font-semibold mb-2">Why Choose Us?</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>
              A Legacy of Trust: Over a decade of delivering quality products
              and services.
            </li>
            <li>
              Customer-Centric Approach: Your satisfaction is our priority.
            </li>
            <li>
              Innovative Solutions: We bring you the latest gadgets and
              accessories from top global brands.
            </li>
            <li>
              Nationwide Presence: Retail hubs across Bangladesh with plans for
              international expansion.
            </li>
            <li>
              Commitment to Excellence: Award-winning service and dedication to
              innovation.
            </li>
          </ul>

          <p className="italic">
            KRY International is more than just a company—it’s a promise to
            bring the best of technology to your doorstep. Join us as we
            continue to innovate, expand, and redefine the tech industry for the
            better.
          </p>

          <p className="mt-4 font-semibold">Let’s shape the future together.</p>

          <h2 className="text-xl font-bold mt-10 mb-2">আমাদের সম্পর্কে</h2>
          <p className="mb-4">
            কেআরওয়াই ইন্টারন্যাশনাল-এ আপনাকে স্বাগতম। বাংলাদেশে মোবাইল এবং
            গ্যাজেট ইন্ডাস্ট্রিতে আস্থা, উদ্ভাবন এবং শ্রেষ্ঠত্বের প্রতীক একটি
            নাম। ২০১১ সালে একটি ছোট অনলাইন ভেঞ্চার হিসেবে আমাদের যাত্রা শুরু
            হয়েছিল। আজ আমরা এমন একটি প্রতিষ্ঠানে পরিণত হয়েছি, যা গ্রাহকদের
            জন্য সর্বাধুনিক প্রযুক্তি এবং অতুলনীয় সেবা নিশ্চিত করে।
          </p>
          <h3 className="text-lg font-semibold mb-2">আমাদের যাত্রার গল্প</h3>
          <p className="mb-4">
            আমাদের গল্প শুরু হয়েছিল একজন দূরদৃষ্টিসম্পন্ন উদ্যোক্তা, আমাদের সিইও
            কামরুল ইসলাম-এর একটি স্বপ্ন থেকে। তাঁর অদম্য পরিশ্রম, নিষ্ঠা এবং
            শ্রেষ্ঠত্বের প্রতি একাগ্রতাই আমাদের সাফল্যের মূল কারণ। তাঁর নেতৃত্বে
            কেআরওয়াই ইন্টারন্যাশনাল ২০১৫ সালে প্রথম ফিজিক্যাল স্টোর চালু করে।
            এর পরের বছরগুলোতে আমরা দ্রুত প্রসারিত হই। ২০১৭ সালে আরও দুটি আউটলেট
            স্থাপন করি এবং ২০১৮ সালে যমুনা ফিউচার পার্ক-এ একটি স্টোর চালু করি।
            একই বছরে, আমরা ঢাকার বাইরেও আমাদের সেবা বিস্তৃত করি।
          </p>
          <h3 className="text-lg font-semibold mb-2">প্রতিরোধের গল্প</h3>
          <p className="mb-4">
            কোভিড-১৯ মহামারীর সময় যখন ব্যবসাগুলো অভূতপূর্ব চ্যালেঞ্জের মুখোমুখি
            হয়েছিল, কেআরওয়াই ইন্টারন্যাশনাল দৃঢ়ভাবে স্থির ছিল। আমাদের সিইও নিজেই
            গ্রাহকদের কাছে পণ্য সরবরাহ করেছিলেন, যা দেখিয়েছিল যে আমাদের
            প্রতিশ্রুতি শুধু ব্যবসার জন্য নয়-এটি একটি প্রতিশ্রুতি, কঠিন সময়েও
            যত্ন নেওয়ার। এই প্রতিরোধ এবং নিষ্ঠার মানসিকতাই কেআরওয়াই
            ইন্টারন্যাশনালকে গ্রাহক-কেন্দ্রিক ব্র্যান্ড হিসেবে প্রতিষ্ঠিত করেছে।
          </p>
          <h3 className="text-lg font-semibold mb-2">আমাদের ভবিষ্যৎ লক্ষ্য</h3>
          <p className="mb-4">
            কেআরওয়াই ইন্টারন্যাশনালের যাত্রা এখানেই শেষ নয়। আমরা গ্যাজেট এবং
            আইটি সেক্টরে নেতৃত্ব দেওয়ার লক্ষ্যে কাজ করছি। উদ্ভাবনী পণ্য চালু
            করা, আমাদের রিটেইল নেটওয়ার্ক বাড়ানো এবং গ্রাহকের অভিজ্ঞতা আরও উন্নত
            করার দিকে আমরা প্রতিশ্রুতিবদ্ধ। একটি আন্তর্জাতিক প্লেয়ার হিসেবে
            প্রতিষ্ঠা পাওয়ার স্বপ্ন নিয়ে আমরা সবাইকে সর্বাধুনিক প্রযুক্তি
            সহজলভ্য করতে কাজ করে যাচ্ছি।
          </p>
          <h3 className="text-lg font-semibold mb-2">অর্জন এবং স্বীকৃতি</h3>
          <p className="mb-4">
            কেআরওয়াই ইন্টারন্যাশনাল গর্বিত যে আমরা বাংলাদেশে বেস্ট সেলার
            অ্যাওয়ার্ড এবং বেস্ট রিটেইলার অ্যাওয়ার্ড-এর মতো অসংখ্য স্বীকৃতি
            অর্জন করেছি। এই অর্জনগুলো আমাদের শ্রেষ্ঠত্বের প্রতি প্রতিশ্রুতি এবং
            প্রতিযোগিতামূলক বাজারে খাপ খাওয়ানোর সক্ষমতার প্রতিফলন।
          </p>
          <h3 className="text-lg font-semibold mb-2">আমাদের মিশন</h3>
          <p className="mb-4">
            গ্রাহকদের এমন অভিজ্ঞতা প্রদান করা যা সর্বাধুনিক প্রযুক্তি, অতুলনীয়
            সেবা এবং এমন সমাধান নিয়ে আসে যা আমাদের কমিউনিটির ক্রমবর্ধমান চাহিদা
            পূরণ করে।
          </p>
          <h3 className="text-lg font-semibold mb-2">আমাদের ভিশন</h3>
          <p className="mb-4">
            উদ্ভাবনী পণ্য, সহজলভ্য প্রযুক্তি এবং ব্যতিক্রমী সেবার মাধ্যমে
            গ্যাজেট এবং আইটি সেক্টরে একটি বৈশ্বিক নেতা হওয়া, এবং আমাদের
            গ্রাহকদের সাথে গভীর সম্পর্ক স্থাপন করা।
          </p>
          <h3 className="text-lg font-semibold mb-2">
            কেন আমাদের নির্বাচন করবেন?
          </h3>
          <ul className="list-disc pl-5 mb-4">
            <li>
              আস্থার ইতিহাস: এক দশকেরও বেশি সময় ধরে মানসম্পন্ন পণ্য এবং সেবা
              সরবরাহ।
            </li>
            <li>
              গ্রাহক-কেন্দ্রিক পদ্ধতি: আপনার সন্তুষ্টিই আমাদের অগ্রাধিকার।
            </li>
            <li>
              উদ্ভাবনী সমাধান: বিশ্বমানের ব্র্যান্ড থেকে সর্বাধুনিক গ্যাজেট এবং
              অ্যাকসেসরিজ।
            </li>
            <li>
              সারাদেশে উপস্থিতি: বাংলাদেশজুড়ে রিটেইল হাব এবং আন্তর্জাতিক
              সম্প্রসারণের পরিকল্পনা।
            </li>
            <li>
              শ্রেষ্ঠত্বের প্রতিশ্রুতি: পুরস্কারপ্রাপ্ত সেবা এবং উদ্ভাবনের প্রতি
              অঙ্গীকার।
            </li>
          </ul>
          <p className="italic">
            কেআরওয়াই ইন্টারন্যাশনাল কেবল একটি কোম্পানি নয়-এটি এমন একটি
            প্রতিশ্রুতি, যা আপনার দোরগোড়ায় সর্বাধুনিক প্রযুক্তি নিয়ে আসে। আমাদের
            সাথে যোগ দিন, আমরা উদ্ভাবন, সম্প্রসারণ এবং প্রযুক্তি শিল্পের আরও
            ভালো ভবিষ্যৎ গড়ার দিকে এগিয়ে চলেছি।
          </p>
          <p className="italic mt-4">চলুন একসাথে ভবিষ্যৎ গড়ি।</p>
        </div>
      </div>
    </div>
  );
}
