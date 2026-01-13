
import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
};

const submenuVariants = {
  hidden: { opacity: 0, x: -10, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3 } },
};

const childMenuVariants = {
  hidden: { opacity: 0, x: 10, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3 } },
};

const FilterProduct = ({data}) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<number | null>(null);

  const specialCategories = ["Phone", "Tablet"];

  // Separate special categories from others
  const sortedCategories = data?.data?.productCategories
    ? [
        ...data.data.productCategories.filter((cat) => specialCategories.includes(cat.name)),
        ...data.data.productCategories.filter((cat) => !specialCategories.includes(cat.name)),
      ]
    : [];

  // Group subcategories by categoryId and filter out child subcategories
  const subcategoryMap = data?.data?.subCategories?.reduce(
    (acc, sub) => {
      if (!sub.parentSubCategoryId) {
        if (!acc[sub.categoryId]) acc[sub.categoryId] = [];
        acc[sub.categoryId].push({
          id: sub.id,
          name: sub.name,
          link: sub.link,
          childSubCategory: sub.childSubCategory || [],
        });
      }
      return acc;
    },
    {} as Record<
      number,
      Array<{
        id: number;
        name: string;
        link: string;
        childSubCategory: Array<{
          id: number;
          name: string;
          link: string;
        }>;
      }>
    >
  );

  // Get brands for each category from BrandWiseCategory
  const getBrandsForCategory = (categoryId: number) => {
    const category = data?.data?.productCategories?.find(cat => cat.id === categoryId);
    if (!category?.BrandWiseCategory) return [];
    
    return category.BrandWiseCategory
      .map(item => item.brand)
      .filter(brand => brand); // Filter out any undefined brands
  };

  // Determine if the category is on the right side of the screen
  const isRightSideCategory = (index: number) => {
    const totalCategories = sortedCategories.length;
    return index > Math.floor(totalCategories / 2);
  };

  return (
    <div className="relative w-full z-10">
      <div className="bg-white border-t mx-1 border-b border-[#ABC3E3] hidden lg:block">
        <div className="max-w-[1650px] mx-auto flex items-center justify-center">
          {sortedCategories.map((item, index) => (
            <div
              key={index}
              className="relative group flex-1 text-center border-r border-[#ABC3E3] last:border-r-0"
              onMouseEnter={() => setActiveMenu(item.id)}
              onMouseLeave={() => {
                setActiveMenu(null);
                setActiveSubMenu(null);
                setHoveredSubcategory(null);
              }}
            >
              <div className="block uppercase text-primary text-xs font-bold py-3 px-2 hover:text-blue-900 cursor-pointer">
                <Link to={`/category/${item?.link}`}>{item.name}</Link>
              </div>

              {/* Dropdown Menu */}
              {activeMenu === item.id && (
                <motion.div
                  className="absolute left-0 top-full w-full bg-white shadow-lg"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                  <ul className="px-2 pt-3">
                    {/* Brand menu item for all categories */}
                    <li
                      className="relative text-start group border-b cursor-pointer px-4 py-3 text-sm text-[#393939] font-bold hover:text-primary hover:bg-gray-100 duration-300 hover:translate-x-1"
                      onMouseEnter={() => setActiveSubMenu(`Brand-${item.id}`)}
                    >
                      Brand
                      
                      {/* Brand submenu - position left for right-side categories */}
                      {activeSubMenu === `Brand-${item.id}` && (
                        <motion.div
                          className={`absolute ${isRightSideCategory(index) ? 'right-full' : 'left-full'} top-0 ${isRightSideCategory(index) ? 'mr-1' : 'ml-1'} min-w-[500px] bg-white shadow-sm`}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={submenuVariants}
                        >
                          <div className="max-h-[70vh] overflow-y-auto shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {getBrandsForCategory(item.id).map((brand, index) => (
                              <Link to={`/brand/${brand?.link}`} key={index}>
                                <div
                                  className="px-4 hover:bg-gray-100"
                                  onClick={() => {
                                    setActiveMenu(null);
                                    setActiveSubMenu(null);
                                  }}
                                >
                                  <div className="px-4 py-3 border-b text-sm text-[#393939] font-bold hover:text-primary duration-300 hover:translate-x-1 cursor-pointer whitespace-nowrap">
                                    {brand.brand}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </li>

                    {/* Special Case: Phone & Tablet - show additional menus */}
                    {specialCategories.includes(item.name) && (
                      <>
                        {["Feature", "Condition"].map((subItem) => (
                          <li
                            key={subItem}
                            className="relative text-start group border-b cursor-pointer px-4 py-3 text-sm text-[#393939] font-bold hover:text-primary hover:bg-gray-100 duration-300 hover:translate-x-1"
                            onMouseEnter={() => setActiveSubMenu(subItem)}
                          >
                            {subItem}

                            {/* FEATURE */}
                            {subItem === "Feature" && activeSubMenu === "Feature" && (
                              <motion.div
                                className={`absolute ${isRightSideCategory(index) ? 'right-full' : 'left-full'} top-0 ${isRightSideCategory(index) ? 'mr-1' : 'ml-1'} min-w-[200px] bg-white shadow-sm`}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={submenuVariants}
                              >
                                <ul className="space-y-4 min-w-[200px]">
                                  {data?.data?.features?.length > 0 &&
                                    data?.data?.features.map((feature, index) => (
                                      <Link to={`/feature/${feature?.link}`} key={index}>
                                        <li
                                          className="px-4 hover:bg-gray-100"
                                          onClick={() => {
                                            setActiveMenu(null);
                                            setActiveSubMenu(null);
                                          }}
                                        >
                                          <div className="px-4 text-center py-3 border-b text-sm text-[#393939] font-bold hover:text-primary duration-300 hover:translate-x-1 cursor-pointer whitespace-nowrap">
                                            {feature.name}
                                          </div>
                                        </li>
                                      </Link>
                                    ))}
                                </ul>
                              </motion.div>
                            )}
                            
                            {/* CONDITION */}
                            {subItem === "Condition" && activeSubMenu === "Condition" && (
                              <motion.div
                                className={`absolute ${isRightSideCategory(index) ? 'right-full' : 'left-full'} top-0 ${isRightSideCategory(index) ? 'mr-1' : 'ml-1'} min-w-[200px] bg-white shadow-sm`}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={submenuVariants}
                              >
                                <ul className="space-y-4 min-w-[200px]">
                                  {data?.data?.conditions?.length > 0 &&
                                    data?.data?.conditions?.map((condition, index) => (
                                      <Link to={`/condition/${condition?.link}`} key={index}>
                                        <li
                                          className="px-4 hover:bg-gray-100"
                                          onClick={() => {
                                            setActiveMenu(null);
                                            setActiveSubMenu(null);
                                          }}
                                        >
                                          <div className="px-4 text-center py-3 border-b text-sm text-[#393939] font-bold hover:text-primary duration-300 hover:translate-x-1 cursor-pointer whitespace-nowrap">
                                            {condition.name}
                                          </div>
                                        </li>
                                      </Link>
                                    ))}
                                </ul>
                              </motion.div>
                            )}
                          </li>
                        ))}
                      </>
                    )}

                    {/* Default Case: Show Subcategories (excluding child subcategories) */}
                    {subcategoryMap?.[item.id]?.map((sub) => (
                      <li
                        key={sub.id}
                        className="relative px-2 hover:bg-gray-100 border-b text-start"
                        onMouseEnter={() => setHoveredSubcategory(sub.id)}
                        onMouseLeave={() => setHoveredSubcategory(null)}
                      >
                        <Link to={`/sub-category/${sub?.link}`}>
                          <div
                            className="flex items-center justify-between px-2 py-2 text-sm text-[#393939] font-bold hover:text-primary duration-300 hover:translate-x-1 cursor-pointer"
                            onClick={() => {
                              setActiveMenu(null);
                              setActiveSubMenu(null);
                            }}
                          >
                            <span>{sub.name}</span>
                            {sub.childSubCategory.length > 0 && (
                              <span className="">
                                <IoIosArrowForward />
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Child Subcategories */}
                        {sub.childSubCategory.length > 0 &&
                          hoveredSubcategory === sub.id && (
                            <motion.div
                              className={`absolute ${isRightSideCategory(index) ? 'right-full' : 'left-full'} top-0 ${isRightSideCategory(index) ? 'mr-5' : 'ml-1'} min-w-[200px] bg-white shadow-sm`}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              variants={childMenuVariants}
                            >
                              <ul className="py-1">
                                {sub.childSubCategory.map((child) => (
                                  <Link to={`/sub-category/${child.link}`} key={child.id}>
                                    <li
                                      className="px-4 hover:bg-gray-100"
                                      onClick={() => {
                                        setActiveMenu(null);
                                        setHoveredSubcategory(null);
                                      }}
                                    >
                                      <div className="px-4 py-2 text-sm text-[#393939] font-bold hover:text-primary duration-300 hover:translate-x-1 cursor-pointer">
                                        {child.name}
                                      </div>
                                    </li>
                                  </Link>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterProduct;