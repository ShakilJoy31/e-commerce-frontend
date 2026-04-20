import FilterProduct from "@/components/pagesComponents/homeComponents/FilterProduct";
import {FaRegHeart, FaRegUser } from "react-icons/fa";
import { IoCartOutline, IoLocationOutline, IoSearch } from "react-icons/io5";
import { MdOutlineLocalOffer, MdOutlineLogout } from "react-icons/md";
// import chat from "../../../assets/images/icon/live-chat.png";
import { CgProfile } from "react-icons/cg";
import { publicNavigationLinks } from "@/components/navigationLinks/publicNavigationLinks/publicNavigationLinks";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/components/context/CartContext";
import { useWishList } from "@/components/context/WishListContext";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import { RiAdminLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { SlCalender } from "react-icons/sl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiAccountCircleLine } from "react-icons/ri";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { IoMdArrowDropdown } from "react-icons/io";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useGetSearchProductsQuery } from "@/components/store/api/products/productApi";
import { useDebounce } from "use-debounce";
import logo from "@/assets/images/icon/systech-bd-1761568143.png";

export default function PublicHeader({data, isLoading:bannerLoading}) {
   console.log(bannerLoading)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector(selectUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wish } = useWishList();
  const wrapperRef = useRef<HTMLDivElement>(null);


  const [placeholder, setPlaceholder] = useState("Search products");


  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (data?.data?.searchData?.length) {
      let index = 0;
      const searchOptions = data.data.searchData.map((item) => item.search);
      const interval = setInterval(() => {
        setPlaceholder(`${searchOptions[index]}`);
        index = (index + 1) % searchOptions.length;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [data?.data?.searchData]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch product data based on search query
  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetSearchProductsQuery( debouncedSearchQuery ? { search: debouncedSearchQuery } : null,
  {
    skip: !debouncedSearchQuery, // Skip the query if no search term
  }) as any;
  useEffect(() => {
    if (debouncedSearchQuery && productsData?.data) {
      const filteredSuggestions = productsData?.data?.filter((product: any) => {
        const productName = product?.productName || "";
        return productName
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase());
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery, productsData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion?.productName);
    setSuggestions([]);
    if (suggestion.productName) {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery) {
      navigate(`/products?search=${searchQuery}`);
      setSuggestions([]);
      setSearchQuery("");
    }
  };
  const handleLogout = () => {
    // Remove token cookie
    shareWithCookies("remove", "__t_beta__token");
    window.location.reload();
    // Redirect to login
    navigate("/login", { replace: true });
  };

  const companyName = data?.data?.companyInfo[0]?.companyName;
  console.log(companyName)
  // const logo = data?.data?.companyInfo[0]?.logo;
    // const logo = data?.data?.companyInfo[0]?.logo;

  return (
    <div className="sticky top-0 z-50 bg-[#F1F1F1] px-5 w-full">
      <div className="hidden lg:block">
        <div className=" bg-[#F1F1F1]">
          <div className="flex justify-between items-center text-white max-w-[1650px] gap-3 mx-auto px-3 py-2.5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="SECURETECHBD Logo"
                className="h-[47px] rounded-full "
              />
              {/* <h3 className="text-[20px] hidden lg:block font-bold text-primary">
                {bannerLoading ? <ButtonLoader /> : companyName}
              </h3> */}
            </Link>

            {/* SEARCH BUTTON */}
            <div ref={wrapperRef} className="flex-1 mx-6 relative">
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full"
                autoComplete="off"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true); // Important: Open dropdown when typing
                    handleSearchChange(e);
                  }}
                  className="w-full px-4 text-primary pr-10 py-1 border-2 border-[#ABC3E3] bg-white rounded-full text-base focus:outline-none "
                  placeholder=""
                />

                {searchQuery === "" && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={placeholder}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.5 }}
                      >
                       Search for {placeholder}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}

                <button
                  type="submit"
                  className="absolute px-[13px] py-2.5 overflow-hidden top-1/2 right-0 rounded-r-md -translate-y-1/2 text-white"
                >
                  <IoSearch className="text-lg text-[#ABC3E3]" />
                </button>
              </form>

              {searchQuery && isDropdownOpen && (
                <div className="absolute bg-white text-black w-full mt-1 rounded-md shadow-lg max-h-[300px] overflow-auto z-50">
                  {isLoading ? (
                    <div className="pl-5 py-5">
                      <ButtonLoader />
                    </div>
                  ) : (
                    <>
                      {!isError && suggestions?.length > 0 ? (
                        suggestions.map((suggestion: any) => (
                          <Link
                            key={suggestion.id}
                            to={`/products/${suggestion.productLink}`}
                            className="block px-4 py-2 hover:bg-gray-200"
                            onClick={() => {
                              handleSuggestionClick(suggestion);
                              setIsDropdownOpen(false); // Close dropdown when item is clicked
                            }}
                          >
                            {suggestion.productName}
                          </Link>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-sm lg:text-base font-semibold">
                          No suggestions found
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* <div className="border border-[#ABC3E3] bg-[#FFF] rounded-full">
              <Link
                to="/products"
                className="text-gray-600 px-2 py-1.5 flex items-center gap-1"
              >
                <RiShoppingBasketLine className="text-xl" />
                <span className="text-sm font-semibold">Shop</span>
              </Link>
            </div> */}
            <div className="border border-[#ABC3E3] bg-[#FFF] rounded-full">
              <Link
                to="/pre-order-form"
                className="text-gray-600 px-2 py-1.5 flex items-center gap-1"
              >
                <SlCalender size={15} className=" text-primary" />
                <span className="text-sm font-semibold">Pre Order</span>
              </Link>
            </div>
            <div className="border border-[#ABC3E3] bg-[#FFF] rounded-full">
              <Link
                to="/latest-offer"
                className="text-gray-600 px-2 py-1.5 flex items-center gap-1"
              >
                <MdOutlineLocalOffer className="text-xl" />
                <span className="text-sm font-semibold">Discount / Offer</span>
              </Link>
            </div>

            <div>
              <Link
                to="/our-branches"
                className="text-primary px-2 py-1.5 flex items-center gap-1"
              >
                <IoLocationOutline className="text-xl" />
                <span className="text-sm font-semibold">Store Location</span>
              </Link>
            </div>
            <Link to="/cart" className="flex items-center gap-0.5">
              <div className="relative">
                <IoCartOutline className="text-[26px] text-gray-700" />
                <span className="w-4 h-4 pb-0.5 rounded-full flex items-center justify-center absolute -top-2 left-1.5 text-white text-xs bg-[#D62020]">
                  {cart?.length}
                </span>
              </div>
              <h3 className="text-sm flex items-center gap-1 font-semibold text-primary">
                Cart{" "}
              </h3>
            </Link>

            <Link to="/wishlist" className="relative">
              <div title="Wishlist">
                <FaRegHeart size={20} className="text-gray-700" />
                <span className="w-4 h-4 absolute -top-3 left-0.5 rounded-full flex items-center justify-center text-white text-xs bg-[#D62020]">
                  {wish?.length}
                </span>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="hidden lg:flex gap-4 items-center">
              {user?.id && user?.email ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer" asChild>
                      {user?.avatar ? (
                        <div className="flex items-end">
                          <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <IoMdArrowDropdown className="text-xl -ml-2" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CgProfile size={30} />
                          <IoMdArrowDropdown className="text-xl -ml-2" />
                        </div>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 mr-5">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <Link to={"/my-account"}>
                          <DropdownMenuItem className="cursor-pointer">
                            Account
                            <DropdownMenuShortcut>
                              <RiAccountCircleLine className="text-xl" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      {user?.role.toLowerCase() !== "user" && (
                        <>
                          <DropdownMenuGroup>
                            <Link to={"/kry-admin-portal/admin_home"}>
                              <DropdownMenuItem className="cursor-pointer">
                                Admin Dashboard
                                <DropdownMenuShortcut>
                                  <RiAdminLine className="text-xl" />
                                </DropdownMenuShortcut>
                              </DropdownMenuItem>
                            </Link>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        Log out
                        <DropdownMenuShortcut>
                          <MdOutlineLogout className="text-xl" />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <div className="border border-[#ABC3E3]  bg-[#FFF] rounded-full">
                    <div className="flex items-center gap-1 px-2 py-1.5">
                      <CgProfile className="text-gray-700 text-xl" />
                      <Link
                        to={"/login"}
                        className="text-sm font-semibold text-[#2E32D4]"
                      >
                        Login
                      </Link>
                      <span className="text-sm font-semibold text-[#4B4B4B]">
                        or
                      </span>
                      <Link
                        to={"/registration"}
                        className="text-sm font-semibold text-[#2E32D4]"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Menu for Mobile */}
        <div className="relative lg:hidden">
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="absolute w-full mx-auto flex justify-center flex-col items-center text-center bg-white mb-3 text-black rounded-b-md shadow-md p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  opacity: { duration: 0.2 },
                  y: { type: "spring", stiffness: 300, damping: 25 },
                }}
              >
                {/* Navigation Links */}
                <div className="flex flex-col gap-3 mb-4">
                  {publicNavigationLinks.map((link) => (
                    <Link
                      onClick={() => setIsDropdownOpen(false)}
                      key={link.key}
                      to={link.href}
                      className={`font-semibold text-[16px] hover:border-b-2 ${
                        location.pathname === link.href
                          ? "border-b-2 border-primary"
                          : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {user?.id && user?.email ? (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          {user?.avatar ? (
                            <div className="flex items-end">
                              <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full"
                              />
                              <IoMdArrowDropdown className="text-xl -ml-2" />
                            </div>
                          ) : (
                            <div className="flex items-end">
                              <CgProfile size={30} />
                              <IoMdArrowDropdown className="text-xl -ml-2" />
                            </div>
                          )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36 mr-5">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Link to={"/my-account"}>
                              <DropdownMenuItem>
                                Account
                                <DropdownMenuShortcut>
                                  <RiAccountCircleLine />
                                </DropdownMenuShortcut>
                              </DropdownMenuItem>
                            </Link>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleLogout}>
                            Log out
                            <DropdownMenuShortcut>
                              <MdOutlineLogout />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    <>
                      <p>
                        <span className="text-sm font-semibold flex items-center text-start gap-1 text-[#48C8FF]">
                          <FaRegUser className="text-xl text-primary" />
                          <div>
                            <h3 className="text-base font-bold text-primary">
                              Account
                            </h3>
                            <div
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-1"
                            >
                              <Link to={"/registration"}>Register</Link> or{" "}
                              <Link to={"/login"}>Login</Link>
                            </div>
                          </div>
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <FilterProduct data={data}/>
      </div>
    </div>
  );
}
