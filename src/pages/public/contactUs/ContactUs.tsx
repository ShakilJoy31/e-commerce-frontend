import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { MdArrowForwardIos } from "react-icons/md";
import bannerbg from "../../../assets/images/icon/otherbg.png";

export default function ContactUs() {
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
          <h2 className="text-[24px] font-semibold text-center">CONTACT US</h2>
          <h2 className="text-[14px] font-medium flex items-center">
            HOME{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Contact Us
          </h2>
        </SectionWrapper>
      </div>

      {/* Map Section */}
      <div className="w-full py-8 lg:px-20 px-3">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9020386849846!2d90.391509!3d23.7515879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b898a62fc469%3A0x7a282fb52d0332d!2sBashundhara%20City%20Shopping%20Complex!5e0!3m2!1sen!2sbd!4v1674600000000!5m2!1sen!2sbd"
          className="w-full h-[400px] border-0"
          loading="lazy"
        ></iframe>
      </div>

      {/* Content Section */}
      <SectionWrapper>
        <div className="flex lg:px-20 px-3 flex-col lg:flex-row gap-8 items-start">
          {/* Form Section */}
          <div className="flex-1 w-full">
            <h3 className="text-[24px] font-semibold mb-4">Get in Touch</h3>
            <p className="text-gray-600 mb-8">
              Please enter the details of your request. A member of our support
              staff will respond as soon as possible.
            </p>
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />
              <textarea
                placeholder="Your message"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                rows={5}
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700 self-start"
              >
                Submit Now
              </button>
            </form>
          </div>

          {/* Address Section */}
          <div className="lg:w-1/3 w-full  p-6 mb-16">
            <h3 className="text-[20px] font-semibold mb-4">Main Branch</h3>
            <p>
              <strong>Address:</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Bashundhara City Shopping Complex, Dhaka. <br />
              Basement 1: Shop 32 <br />
              Basement 2: Shop No. 85-86
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Phone Number:</strong>
            </p>
            <p className="text-gray-700 mb-4">01958-044505, 01958-044504</p>
            <p className="text-gray-700 mb-4">
              <strong>Opening Time:</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Open 10:30 AM to 8:30 PM <br />
              Off Day: Tuesday
            </p>
            <p>
              <strong>Facebook Page:</strong>
            </p>
            <p className="text-gray-700">
              {" "}
              <a
                href="https://facebook.com/KRYINTERNATIONAL"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                KRY INTERNATIONAL
              </a>
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
