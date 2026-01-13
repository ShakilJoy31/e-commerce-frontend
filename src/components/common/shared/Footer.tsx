import { FaFacebookSquare } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { AiFillTikTok } from "react-icons/ai";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import payment from "../../../assets/images/footer/SSLCommerz.jpg";
import ButtonLoader from "@/components/loader/ButtonLoader";

const Footer = ({ data, isLoading }) => {

  const policyPages =
    data?.data?.pages?.filter((page) =>
      page?.title?.toLowerCase().includes("policy")
    ) || [];
  const helpFulLinks =
    data?.data?.pages?.filter((page) =>
      page?.title?.toLowerCase().includes("kry")
    ) || [];

  const otherPages =
    data?.data?.pages?.filter(
      (page) =>
        !page?.title?.toLowerCase().includes("policy") &&
        !page?.title?.toLowerCase().includes("kry")
    ) || [];

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };
  return (
    <footer className="bg-[#040273]">
      <div className="max-w-screen-xl px-4 pt-5 md:pt-12 pb-6 mx-auto sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex flex-col md:flex-row items-start gap-3 justify-center">
              <img
                src={data?.data?.companyInfo?.[0]?.footerLogo}
                alt="kry-international"
                className="w-16 h-16 mx-auto rounded-full md:mx-0"
              />
              <div className="mx-auto md:mx-0">
                <h1 className="text-xl lg:text-2xl font-bold text-center md:text-start text-white">
                  KRY International
                </h1>
                <p className="text-gray-300">
                  Trusted Online & Offline Shopping Site.
                </p>
              </div>
            </div>

            <div className="md:mt-4 w-full lg:w-4/5">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold py-3 tracking-wider text-white text-center">
                Support
              </h1>
              <div className="flex flex-row md:flex-col justify-center items-center gap-3">
                <h2 className="text-sm md:text-xl lg:text-2xl flex items-center gap-2 md:gap-4 border-2 rounded-full border-white p-2 lg:p-3">
                  <span className="border-r-2 border-white px-1.5 lg:px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 md:w-8 md:h-8 text-white shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </span>
                  <span className="text-white tracking-wide md:tracking-widest">
                    {" "}
                    {isLoading ? (
                      <>
                        <ButtonLoader />
                      </>
                    ) : (
                      <>{data?.data?.companyInfo?.[0]?.phone2}</>
                    )}
                  </span>
                </h2>
                <h2 className="text-sm md:text-xl lg:text-2xl mt-0 md:mt-5 flex items-center px-2 lg:gap-4 border-2 rounded-full border-white p-2 lg:p-3">
                  <Link
                    className="flex items-center justify-center sm:justify-start gap-1.5 group"
                    to="/our-branches"
                  >
                    <span className="border-r-2 border-white px-1 md:px-3">
                      <IoLocationOutline className="text-xl md:text-3xl text-white" />
                    </span>
                    <span className="text-white pl-0 md:pl-3">
                      Find Our Branch
                    </span>
                  </Link>
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:gap-8 grid-cols-2 lg:col-span-2 md:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="text-center sm:text-left">
                <p className="text-lg font-medium text-white">Pages</p>

                <nav className="mt-5">
                  <ul className="space-y-4 text-sm">
                    <Link to="/blogs">
                      <li className="text-white transition hover:text-white/75">
                        Blog
                      </li>
                    </Link>
                    {otherPages?.length > 0 &&
                      otherPages?.map((page: any) => (
                        <Link to={`/pages/${page?.slug}`}>
                          <li className="text-white transition hover:text-white/75 my-4">
                            {page?.title}
                          </li>
                        </Link>
                      ))}
                  </ul>
                </nav>
              </div>
              <div className="text-center sm:text-left block lg:hidden">
                <p className="text-lg font-medium text-white">Helpful Links</p>

                <nav className="mt-5">
                  <ul className="space-y-4 text-sm">
                    {helpFulLinks?.length > 0 &&
                      helpFulLinks?.map((page: any) => (
                        <Link to={`/pages/${page?.slug}`}>
                          <li className="text-white transition hover:text-white/75 my-4">
                            {page?.title}
                          </li>
                        </Link>
                      ))}
                  </ul>
                </nav>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Our Policy</p>

              <nav className="mt-5">
                <ul className="space-y-4 text-sm">
                  {policyPages?.length > 0 &&
                    policyPages?.map((page: any) => (
                      <Link to={`/pages/${page?.slug}`}>
                        <li className="text-white transition hover:text-white/75 my-4">
                          {page?.title}
                        </li>
                      </Link>
                    ))}
                </ul>
              </nav>
            </div>

            <div className="text-center sm:text-left hidden lg:block">
              <p className="text-lg font-medium text-white">Helpful Links</p>

              <nav className="mt-5">
                <ul className="space-y-4 text-sm">
                  {helpFulLinks?.length > 0 &&
                    helpFulLinks?.map((page: any) => (
                      <Link to={`/pages/${page?.slug}`}>
                        <li className="text-white transition hover:text-white/75 my-4">
                          {page?.title}
                        </li>
                      </Link>
                    ))}
                </ul>
              </nav>
            </div>

            <div className="text-center sm:text-left hidden md:block">
              <p className="text-lg font-medium text-white">Contact Us</p>

              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-start justify-center gap-1.5 sm:justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  <address className="-mt-0.5 not-italic text-white">
                    Bashundhara City Shopping Complex, Dhaka
                  </address>
                </li>
                <li>
                  <p className="max-w-md mx-auto mt-6 leading-relaxed text-center text-gray-300 sm:max-w-xs sm:mx-0 sm:text-left">
                    Join Our Social Community:
                  </p>

                  {/* SOCIAL ICON */}
                  <div className="flex justify-center gap-4 mt-5 sm:justify-start">
                    <li>
                      <a
                        href="https://www.facebook.com/KryInternational"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-white  duration-300 transition"
                      >
                        <span className="sr-only">Facebook</span>
                        <FaFacebookSquare className="text-3xl" />
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://www.instagram.com/kry.international"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-white  duration-300 transition"
                      >
                        <span className="sr-only">Instagram</span>
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://www.youtube.com/@kryinternational"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-white  duration-300 transition"
                      >
                        <span className="sr-only">Youtube</span>
                        <AiOutlineYoutube className="text-4xl" />
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://www.tiktok.com/@kry_international?lang=en"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-white  duration-300 transition"
                      >
                        <span className="sr-only">Tiktok</span>
                        <AiFillTikTok className="text-3xl" />
                      </a>
                    </li>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center sm:text-left block md:hidden mt-10">
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-start justify-center gap-1.5 sm:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <address className="-mt-0.5 not-italic text-white">
                Bashundhara City Shopping Complex, Dhaka
              </address>
            </li>
            <li>
              <p className="max-w-md mx-auto leading-relaxed text-center text-gray-300 sm:max-w-xs sm:mx-0 sm:text-left">
                Join Our Social Community:
              </p>

              {/* SOCIAL ICON */}
              <div className="flex justify-center gap-4 mt-5 sm:justify-start">
                <li>
                  <a
                    href="https://www.facebook.com/KryInternational"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-white  duration-300 transition"
                  >
                    <span className="sr-only">Facebook</span>
                    <FaFacebookSquare className="text-3xl" />
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.instagram.com/kry.international"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-white  duration-300 transition"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.youtube.com/@kryinternational"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-white  duration-300 transition"
                  >
                    <span className="sr-only">Youtube</span>
                    <AiOutlineYoutube className="text-4xl" />
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.tiktok.com/@kry_international?lang=en"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-white  duration-300 transition"
                  >
                    <span className="sr-only">Tiktok</span>
                    <AiFillTikTok className="text-3xl" />
                  </a>
                </li>
              </div>
            </li>
          </ul>
        </div>
        <div className=" md:mt-12 border-t border-gray-500">
          {/* <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-base font-bold text-gray-300">
              <span className="block sm:inline">Developed By :</span>{" "}
              <a
                className="inline-block text-white transition animate-pulse"
                href="https://techelementit.com/"
                target="_blank"
                title="Visit our website"
              >
                Techelement IT
              </a>
            </p>

            <p className="mt-4 text-sm font-semibold text-gray-300 sm:order-first sm:mt-0">
              <a
                className="text-primary-100 hover:underline font-semibold"
                href="/"
              >
                Kry-International {getCurrentYear()}
              </a>
              . All rights reserved.
            </p>
          </div> */}

          <div className="flex justify-center items-center mt-3">
            <div className="py-1 px-4 bg-white flex gap-7 justify-center items-center">
              <img className="w-full" src={payment} />
            </div>
          </div>

          <p className="pt-4 text-sm text-center font-semibold text-gray-300 mb-12 lg:mb-0">
            <a
              className="text-primary-100 hover:underline font-semibold"
              href="/"
            >
              Kry-International {getCurrentYear()}
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
