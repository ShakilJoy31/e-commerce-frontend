import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { useDebounce } from "use-debounce";
import { useGetSearchProductsQuery } from "@/components/store/api/products/productApi";
import { Link, useNavigate } from "react-router-dom";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { IoSearch } from "react-icons/io5";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import logo from "@/assets/images/icon/systech-bd-1761568143.png";


const MobileNav = ({data, isLoading:bannerLoading}) => {
  console.log("Data in MobileNav Component:", bannerLoading);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [openInnerMenus, setOpenInnerMenus] = useState<{
    [key: string]: boolean;
  }>({});
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };
  const toggleInnerMenu = (menu: string) => {
    setOpenInnerMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };
  const specialCategories = ["Phone", "Tablet"];
  const sortedCategories = data?.data?.productCategories
    ? [
        ...data.data.productCategories.filter((cat) =>
          specialCategories.includes(cat.name)
        ),
        ...data.data.productCategories.filter(
          (cat) => !specialCategories.includes(cat.name)
        ),
      ]
    : [];
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
 
  const [placeholder, setPlaceholder] = useState("Search products");

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  useEffect(() => {
    if (data?.data?.searchData?.length) {
      let index = 0;
      const searchOptions = data?.data?.searchData.map((item) => item.search);
      const interval = setInterval(() => {
        setPlaceholder(`Search by ${searchOptions[index]}`);
        index = (index + 1) % searchOptions.length;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [data?.data?.searchData]);

    const getBrandsForCategory = (categoryId: number) => {
    const category = data?.data?.productCategories?.find(cat => cat.id === categoryId);
    if (!category?.BrandWiseCategory) return [];
    
    return category.BrandWiseCategory
      .map(item => item.brand)
      .filter(brand => brand); // Filter out any undefined brands
  };
  // Fetch product data based on search query
  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetSearchProductsQuery( debouncedSearchQuery ? { search: debouncedSearchQuery } : null,
  {
    skip: !debouncedSearchQuery, 
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
      setSearchOpen(false);
    }
  };
  // Group subcategories by categoryId
  const subcategoryMap = data?.data?.subCategories?.reduce((acc, sub) => {
    if (!acc[sub.categoryId]) acc[sub.categoryId] = [];
    acc[sub.categoryId].push({ id: sub.id, name: sub.name, link: sub.link });
    return acc;
  }, {});
  const handleLogout = () => {
    // Remove token cookie
    shareWithCookies("remove", "__t_beta__token");
    window.location.reload();
    // Redirect to login
    navigate("/login", { replace: true });
  };

  return (
    <div className="sticky top-0 z-50 bg-[#F1F1F1] w-full p-3 block lg:hidden shadow-md">
      {/* Hamburger Icon */}
      {!searchOpen ? (
        <div className="flex items-center justify-between">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-gray-900"
          >
            <FaBars />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
            // data?.data?.companyInfo[0]?.logo
              src={logo}
              alt="KRY Logo"
              className="h-[30px] rounded-full invert brightness-200"
            />
            {/* <h3 className="text-sm font-bold text-primary">
              data?.data?.companyInfo[0]?.companyName
              {bannerLoading ? <ButtonLoader /> : data?.data?.companyInfo[0]?.companyName}
            </h3> */}
          </Link>

          {/* Search Icon */}
          <button onClick={() => setSearchOpen(true)}>
            <FiSearch className="text-gray-400" size={25} />
          </button>
        </div>
      ) : (
        <AnimatePresence>
          /* Expanded Search Bar */
          {searchOpen && (
            <motion.div
              key="search-bar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-center"
            >
              {/* Back Button */}
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xl text-gray-600 mr-3"
              >
                <FaTimes />
              </button>

              {/* Search Input */}
              <div className="flex-1 mx-6 relative">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 text-primary pr-10 py-1 border-2 border-[#ABC3E3] bg-white rounded-full text-base focus:outline-none"
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
                          {placeholder}
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
                {searchQuery && (
                  <div className="absolute bg-white text-black w-full mt-1 rounded-md shadow-lg max-h-[300px] overflow-auto z-50">
                    {isLoading ? (
                      <>
                        <ButtonLoader />
                      </>
                    ) : (
                      <>
                        {!isLoading && !isError && suggestions?.length > 0 ? (
                          suggestions?.map((suggestion: any) => (
                            <Link
                              key={suggestion.id}
                              to={`/products/${suggestion?.productLink}`}
                              className="block px-4 py-2 hover:bg-gray-200"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion?.productName}
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
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Navigation Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 left-0 w-72 bg-white shadow-lg z-[9999]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">KRY INTERNATIONAL</h2>
          <button onClick={toggleMenu} className="text-2xl">
            <FaTimes />
          </button>
        </div>

        {/* Menu Items */}
        <ul className="p-4 overflow-y-auto pb-16 h-screen custom-scroll">
          {sortedCategories.map((item) => (
            <li key={item.id} className="border-b">
              <div
                className="flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSubMenu(item.name)}
              >
                <span className="text-xs py-1 font-semibold uppercase">
                  {item.name}
                </span>
                {openSubMenu === item.name ? (
                  <FiMinus />
                ) : (
                  <AiOutlinePlusCircle />
                )}
              </div>

              <AnimatePresence>
                {openSubMenu === item.name && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-5 border-l-2 border-gray-300 ml-2"
                  >
                    {/* Brand menu item for all categories */}
                    <li className="border-b">
                      <div
                        className="flex justify-between py-2 px-4 text-sm text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer"
                        onClick={() => toggleInnerMenu(`Brand-${item.id}`)}
                      >
                        <span>Brand</span>
                        {openInnerMenus[`Brand-${item.id}`] ? (
                          <FiMinus />
                        ) : (
                          <AiOutlinePlusCircle />
                        )}
                      </div>

                      {openInnerMenus[`Brand-${item.id}`] && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pl-6 border-l-2 border-gray-300 ml-2"
                          onClick={() => setIsOpen(false)}
                        >
                          {getBrandsForCategory(item.id).map((brand, index) => (
                            <Link
                              key={index}
                              to={`/brand/${brand?.link}`}
                            >
                              <li className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                                {brand.brand}
                              </li>
                            </Link>
                          ))}
                        </motion.ul>
                      )}
                    </li>

                    {/* Special Case: Phone & Tablet - show additional menus */}
                    {specialCategories.includes(item.name) && (
                      <>
                        {["Feature", "Condition"].map((subItem) => (
                          <li key={subItem} className="border-b">
                            <div
                              className="flex justify-between py-2 px-4 text-sm text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer"
                              onClick={() => toggleInnerMenu(subItem)}
                            >
                              <span>{subItem}</span>
                              {openInnerMenus[subItem] ? (
                                <FiMinus />
                              ) : (
                                <AiOutlinePlusCircle />
                              )}
                            </div>

                            {openInnerMenus[subItem] && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="pl-6 border-l-2 border-gray-300 ml-2"
                                onClick={() => setIsOpen(false)}
                              >
                                {/* Show Features */}
                                {subItem === "Feature" &&
                                  data?.data?.features?.map((feature) => (
                                    <Link
                                      key={feature.id}
                                      to={`/feature/${feature.link}`}
                                    >
                                      <li className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                                        {feature.name}
                                      </li>
                                    </Link>
                                  ))}

                                {/* Show Conditions */}
                                {subItem === "Condition" &&
                                  data?.data?.conditions?.map((condition) => (
                                    <Link
                                      key={condition.id}
                                      to={`/condition/${condition.link}`}
                                    >
                                      <li className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                                        {condition.name}
                                      </li>
                                    </Link>
                                  ))}
                              </motion.ul>
                            )}
                          </li>
                        ))}
                      </>
                    )}

                    {/* Default Case: Show Subcategories */}
                    {subcategoryMap?.[item.id]?.map((sub) => (
                      <Link key={sub.id} to={`/sub-category/${sub.link}`}>
                        <li
                          onClick={() => setIsOpen(false)}
                          className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                        >
                          {sub.name}
                        </li>
                      </Link>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
          <Link to={"/latest-offer"}>
            <li className="border-b" onClick={()=>setIsOpen(false)}>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-xs py-1 font-semibold uppercase">
                  Discount / Offer
                </span>
              </div>
            </li>
          </Link>
          <Link to={"/track-order"}>
            <li className="border-b" onClick={()=>setIsOpen(false)}>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-xs py-1 font-semibold uppercase">
                  Order Tracking
                </span>
              </div>
            </li>
          </Link>
          <Link to={"/our-branches"}>
            <li className="border-b" onClick={()=>setIsOpen(false)}>
              <div className="flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-100">
                <span className="text-xs py-1 font-semibold uppercase">
                  Store Location
                </span>
              </div>
            </li>
          </Link>
          {user?.id && user?.email ? (
            <>
              {user?.role.toLowerCase() === "admin" && (
                <Link to={"kry-admin-portal/admin_home"} onClick={()=>setIsOpen(false)}>
                  <li className="border-b">
                    <div className="flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span className="text-xs py-1 font-semibold uppercase">
                        Admin Dashboard
                      </span>
                    </div>
                  </li>
                </Link>
              )}
              <Link to={"/my-account"}>
                <li className="border-b" onClick={()=>setIsOpen(false)}>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-100">
                    <span className="text-xs py-1 font-semibold uppercase">
                      My Account
                    </span>
                  </div>
                </li>
              </Link>
              <li className="border-b">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-red-100">
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 py-1 font-semibold uppercase"
                  >
                    Log out
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              {" "}
              <li className="border-b">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-100">
                  <span className="text-xs py-1 font-semibold uppercase">
                    <Link to={"/login"}>Login</Link> /{" "}
                    <Link to={"/registration"}>Registration</Link>
                  </span>
                </div>
              </li>
            </>
          )}
        </ul>
      </motion.div>

      {/* Overlay (Click outside to close menu) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default MobileNav;
