import { useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { RiMenuSearchFill } from "react-icons/ri";
import { FaChevronUp, FaStar } from "react-icons/fa";
import { Grid3x3, LayoutList } from "lucide-react";
import Paragraph from "@/components/typography/Paragraph";
import ProductCard from "@/components/common/card/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useGetBrandsQuery } from "@/components/store/api/brand/brandApi";
import { useGetColorsQuery } from "@/components/store/api/color/colorApi";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import axios from "axios";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import { useGetSubCategoryQuery } from "@/components/store/api/subCategory/subCategoryApi";
import { appConfiguration } from "@/utils/constant/appConfiguration";
interface SortItemsProps {
  onSortChange: (sortOption: string) => void;
  products: any;
  pagination: any;
  isLoadingProducts: boolean;
  categoryIdNumber: any;
  subCategoryIdNumber: any;
  brandIdNumber: any;
  searchQuery: any;
  page: number;
  size:number;
}

const sortOptions = [
  { id: "default", label: "Sort by Default" },
  // { id: "popularity", label: "Sort by Popularity" },
  { id: "average-rating", label: "Sort by Average Rating" },
  { id: "latest", label: "Sort by Latest" },
  { id: "price-low-high", label: "Sort by Price: Low to High" },
  { id: "price-high-low", label: "Sort by Price: High to Low" },
];

const ratings = [
  { id: 1, label: "1 Star" },
  { id: 2, label: "2 Stars" },
  { id: 3, label: "3 Stars" },
  { id: 4, label: "4 Stars" },
  { id: 5, label: "5 Stars" },
];

const FilterNav = ({
  onSortChange,
  products,
  pagination,
  isLoadingProducts,
  categoryIdNumber,
  subCategoryIdNumber,
  brandIdNumber,
  searchQuery,
  // page,
  // size,
}: SortItemsProps) => {
  const [selectedSort, setSelectedSort] = useState<string>("default");
  const [selectedLayout, setSelectedLayout] = useState<string>("grid-4");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>(products);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);

  const { data: categories } = useGetAllCategoryQuery({});
  const { data: brands } = useGetBrandsQuery({});
  const { data: colors } = useGetColorsQuery({});
  const { data: subCategories } = useGetSubCategoryQuery({});

  useEffect(() => {
    if (categoryIdNumber) {
      setSelectedCategories([categoryIdNumber]);
    } else if (subCategoryIdNumber) {
      setSelectedSubCategories([subCategoryIdNumber]);
    } else if (brandIdNumber) {
      setSelectedBrands([brandIdNumber]);
    }
  }, [brandIdNumber, categoryIdNumber, subCategoryIdNumber]);

 

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value);
    }
  };

  const handleCategoryChange = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };
  const handleSubCategoryChange = (id: number) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  const handleBrandChange = (id: number) => {
    setSelectedBrands((prev) =>
      prev.includes(id)
        ? prev.filter((brandId) => brandId !== id)
        : [...prev, id]
    );
  };

  const handleColorChange = (id: number) => {
    setSelectedColors((prev) =>
      prev.includes(id)
        ? prev.filter((colorId) => colorId !== id)
        : [...prev, id]
    );
  };

  const handleRatingChange = (id: number) => {
    setSelectedRatings((prev) =>
      prev.includes(id)
        ? prev.filter((ratingId) => ratingId !== id)
        : [...prev, id]
    );
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  const handleLayoutChange = (layout: string) => {
    setSelectedLayout(layout);
  };

  const fetchFilteredProducts = useCallback(async () => {
    try {
      const payload: any = {
        page: 1,
        perPage: 16,
        minPrice: priceRange[0] > minPrice ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < maxPrice ? priceRange[1] : undefined,
        categories:
          selectedCategories.length > 0 ? selectedCategories : undefined,
        subCategories:
          selectedSubCategories.length > 0 ? selectedSubCategories : undefined,
        ratings: selectedRatings.length > 0 ? selectedRatings : undefined,
        color: selectedColors.length > 0 ? selectedColors : undefined,
        brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      };

       const response = await axios.post(
        `${appConfiguration.baseUrl2}/product/get-products-wite-filter`,
        payload
      );
     
      setFilteredProducts(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch filtered products:", error);
      setFilteredProducts([]);
    }
  }, [
    priceRange,
    minPrice,
    maxPrice,
    selectedCategories,
    selectedSubCategories,
    selectedRatings,
    selectedColors,
    selectedBrands,
  ]);

  // Determine if any filter is selected
  const isFilterApplied =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    selectedRatings.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100000;

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(products);
    } else if (isFilterApplied) {
      fetchFilteredProducts();
    } else {
      setFilteredProducts(products);

      if (products && products.length > 0) {
        const discountPrices = products.flatMap(
          (product: any) =>
            product.VariationProduct?.map((vp: any) => vp.discountPrice) || []
        );

        if (discountPrices.length > 0) {
          setMinPrice(pagination?.meta?.minPrice);
          setMaxPrice(pagination?.meta?.maxPrice);
          setPriceRange([
            pagination?.meta?.minPrice,
            pagination?.meta?.maxPrice,
          ]);
        } else {
          console.warn("No discount prices found in VariationProduct.");
          setMinPrice(0);
          setMaxPrice(100000);
          setPriceRange([0, 100000]);
        }
      } else {
        console.warn(
          "Products array is empty, skipping price range calculation."
        );
        setMinPrice(0);
        setMaxPrice(100000);
        setPriceRange([0, 100000]);
      }
    }
  }, [fetchFilteredProducts, isFilterApplied, selectedBrands, selectedCategories, selectedColors, selectedRatings, priceRange, products, pagination?.meta?.minPrice, pagination?.meta?.maxPrice, searchQuery.length]);

  return (
    <div className="grid grid-cols-12  gap-3  lg:mt-32">
      {/* FILTER */}
      <div className="hidden lg:block col-span-2 border-b h-[60px]">
        <div className="flex items-center gap-2 mt-5">
          <RiMenuSearchFill className="text-xl" />
          <span className="font-bold">FILTER BY</span>
        </div>
      </div>
      {/* Dropdown Menu */}
      <div className="col-span-12 lg:col-span-10 bg-[#E4D3FF] h-[60px] px-2 lg:px-3 rounded-sm flex justify-between items-center">
        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            <motion.div
              className={`flex items-center justify-center gap-5 bg-white w-[46px] h-[46px] rounded-[1px] shadow cursor-pointer ${
                selectedLayout === "grid-4" ? "border-2 border-[#4C47DE]" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleLayoutChange("grid-4")}
            >
              <span className="text-[#4C47DE] font-semibold">
                {" "}
                <svg
                  width="27"
                  height="22"
                  viewBox="0 0 27 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="7.5"
                    y="0.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="14.5"
                    y="0.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="21.5"
                    y="0.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="0.5"
                    y="8.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="7.5"
                    y="8.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="14.5"
                    y="8.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="21.5"
                    y="8.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="0.5"
                    y="16.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="7.5"
                    y="16.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="14.5"
                    y="16.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                  <rect
                    x="21.5"
                    y="16.5"
                    width="5"
                    height="5"
                    rx="0.5"
                    stroke="#4C47DE"
                  />
                </svg>
              </span>
            </motion.div>

            {/* Layout Buttons */}
            <motion.div
              className={`flex items-center justify-center gap-5 bg-white w-[46px] h-[46px] rounded-[1px] shadow cursor-pointer ${
                selectedLayout === "grid-3" ? "border-2 border-[#4C47DE]" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleLayoutChange("grid-3")}
            >
              <span className="text-[#4C47DE] font-semibold">
                <Grid3x3 className="w-6 h-[22px]" />
              </span>
            </motion.div>
            <motion.div
              className={`flex items-center justify-center gap-5 bg-white w-[46px] h-[46px] rounded-[1px] shadow cursor-pointer ${
                selectedLayout === "grid-2" ? "border-2 border-[#4C47DE]" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleLayoutChange("grid-2")}
            >
              <span className="text-[#4C47DE] font-semibold">
                <LayoutList />
              </span>
            </motion.div>
            <div>
              <Paragraph>
                Showing {pagination?.meta?.size} of {pagination?.meta?.total}{" "}
                results
              </Paragraph>
            </div>
          </div>
        </div>

        <div className="block lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                className="flex items-center justify-between gap-5 bg-white px-2 lg:px-4 py-2 rounded-tr-sm rounded-tl-sm shadow cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex gap-2 items-center">
                  <span className="text-[#393939] font-semibold">
                    Filter By
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: selectedSort ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronUp className="text-[#393939]" />
                </motion.div>
              </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[250px] bg-white shadow-md rounded-b-md max-h-[50vh] ml-3 overflow-auto block lg:hidden"
            >
              <DropdownMenuLabel>Filter Items</DropdownMenuLabel>
              <div className="overflow-hidden overflow-y-auto">
                {/* CATEGORY FILTER */}
                <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3">
                  <div className="flex items-center justify-between border-b-2">
                    <Paragraph>Categories</Paragraph>
                    {/* <FaChevronDown className="text-[#393939]" /> */}
                  </div>
                  <div className="my-3">
                    {categories?.data?.map((category: any) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(category?.id)}
                          onCheckedChange={() =>
                            handleCategoryChange(category?.id)
                          }
                        />
                        <span>{category?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-[200px] max-h-[433px] overflow-auto border-2 mt-5 px-2 lg:px-3">
                  <div className="flex items-center justify-between border-b-2">
                    <Paragraph>SubCategories</Paragraph>
                    {/* <FaChevronDown className="text-[#393939]" /> */}
                  </div>
                  <div className="my-3">
                    {subCategories?.data?.map((category: any) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          checked={selectedSubCategories.includes(category?.id)}
                          onCheckedChange={() =>
                            handleSubCategoryChange(category?.id)
                          }
                        />
                        <span>{category?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3 mt-5">
                  {/* Brands Filter */}

                  <div className="flex items-center justify-between border-b-2">
                    <Paragraph>Brands</Paragraph>
                    {/* <FaChevronDown className="text-[#393939]" /> */}
                  </div>
                  <div className="my-3">
                    {brands?.data?.map((brand: any) => (
                      <div key={brand.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={() => handleBrandChange(brand.id)}
                        />
                        <span>{brand.brand}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3 mt-5">
                  <div className="flex items-center justify-between border-b-2">
                    <Paragraph>Prices</Paragraph>
                    {/* <FaChevronDown className="text-[#393939]" /> */}
                  </div>
                  <div className="my-3">
                    <Slider
                      range
                      min={minPrice}
                      max={maxPrice}
                      step={10}
                      value={priceRange}
                      onChange={handlePriceChange}
                      trackStyle={[{ backgroundColor: "#2563eb", height: 5 }]}
                      handleStyle={[
                        { backgroundColor: "#2563eb", border: "none" },
                        { backgroundColor: "#2563eb", border: "none" },
                      ]}
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span className="font-bold">৳ {priceRange[0]}</span>
                      <span className="font-bold">৳ {priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* COLORS  FILTER */}
                <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3 mt-5">
                  <div className="flex items-center justify-between border-b-2">
                    <Paragraph>Colors</Paragraph>
                    {/* <FaChevronDown className="text-[#393939]" /> */}
                  </div>
                  <div className="my-3">
                    {colors?.data?.map((color: any) => (
                      <div key={color.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedColors.includes(color.id)}
                          onCheckedChange={() => handleColorChange(color.id)}
                        />
                        <span>{color?.color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RATING FILTER */}
                <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3 mt-5">
                  <div className="flex items-center justify-between border-b-2">
                    <Paragraph>Ratings</Paragraph>
                    {/* <FaChevronDown className="text-[#393939]" /> */}
                  </div>
                  <div className="my-3">
                    {ratings.map((rating) => (
                      <div
                        key={rating.id}
                        className="flex items-center gap-2 pt-2"
                      >
                        <Checkbox
                          checked={selectedRatings.includes(rating.id)}
                          onCheckedChange={() => handleRatingChange(rating.id)}
                        />
                        {/* Display stars dynamically */}
                        <span className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < rating.id
                                  ? "text-yellow-500 text-xs"
                                  : "text-gray-400 text-xs"
                              }
                            />
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              className="flex items-center justify-between gap-5 bg-white px-2 lg:px-4 py-2 rounded-tr-sm rounded-tl-sm shadow cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex gap-2 items-center">
                <span className="text-[#393939] font-semibold">
                  Default Sorting
                </span>
              </div>
              <motion.div
                animate={{ rotate: selectedSort ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronUp className="text-[#393939]" />
              </motion.div>
            </motion.div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[250px] bg-white shadow-md rounded-b-md overflow-auto "
          >
            <DropdownMenuLabel>Sort Items</DropdownMenuLabel>
            <RadioGroup
              value={selectedSort}
              onValueChange={handleSortChange}
              className=" px-2 lg:px-4"
            >
              {sortOptions?.map((option, index) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 pb-3 pt-1 ${
                    index !== sortOptions.length - 1 ? "border-b" : ""
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <label
                    htmlFor={option.id}
                    className="text-[14px] font-medium"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="col-span-2 mt-8 hidden lg:block">
        {/* CATEGORY FILTER */}
        <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3">
          <div className="flex items-center justify-between border-b-2">
            <Paragraph>Categories</Paragraph>
            {/* <FaChevronDown className="text-[#393939]" /> */}
          </div>
          <div className="my-3">
            {categories?.data?.map((category: any) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCategories.includes(category?.id)}
                  onCheckedChange={() => handleCategoryChange(category?.id)}
                />
                <span>{category?.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[200px] max-h-[433px] overflow-auto border-2 mt-5 px-2 lg:px-3">
          <div className="flex items-center justify-between border-b-2">
            <Paragraph>SubCategories</Paragraph>
            {/* <FaChevronDown className="text-[#393939]" /> */}
          </div>
          <div className="my-3">
            {subCategories?.data?.map((category: any) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedSubCategories.includes(category?.id)}
                  onCheckedChange={() => handleSubCategoryChange(category?.id)}
                />
                <span>{category?.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3 mt-5">
          {/* Brands Filter */}

          <div className="flex items-center justify-between border-b-2">
            <Paragraph>Brands</Paragraph>
            {/* <FaChevronDown className="text-[#393939]" /> */}
          </div>
          <div className="my-3">
            {brands?.data?.map((brand: any) => (
              <div key={brand.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={() => handleBrandChange(brand.id)}
                />
                <span>{brand.brand}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3 mt-5">
          <div className="flex items-center justify-between border-b-2">
            <Paragraph>Prices</Paragraph>
            {/* <FaChevronDown className="text-[#393939]" /> */}
          </div>
          <div className="my-3">
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              step={10}
              value={priceRange}
              onChange={handlePriceChange}
              trackStyle={[{ backgroundColor: "#2563eb", height: 5 }]}
              handleStyle={[
                { backgroundColor: "#2563eb", border: "none" },
                { backgroundColor: "#2563eb", border: "none" },
              ]}
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="font-semibold">৳ {priceRange[0]}</span>
              <span className="font-semibold">৳ {priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* COLORS  FILTER */}
        <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3 mt-5">
          <div className="flex items-center justify-between border-b-2">
            <Paragraph>Colors</Paragraph>
            {/* <FaChevronDown className="text-[#393939]" /> */}
          </div>
          <div className="my-3">
            {colors?.data?.map((color: any) => (
              <div key={color.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedColors.includes(color.id)}
                  onCheckedChange={() => handleColorChange(color.id)}
                />
                <span>{color?.color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RATING FILTER */}
        <div className="w-[200px] max-h-[433px] overflow-auto border-2 px-2 lg:px-3 mt-5">
          <div className="flex items-center justify-between border-b-2">
            <Paragraph>Ratings</Paragraph>
            {/* <FaChevronDown className="text-[#393939]" /> */}
          </div>
          <div className="my-3">
            {ratings.map((rating) => (
              <div key={rating.id} className="flex items-center gap-2 pt-2">
                <Checkbox
                  checked={selectedRatings.includes(rating.id)}
                  onCheckedChange={() => handleRatingChange(rating.id)}
                />
                {/* Display stars dynamically */}
                <span className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < rating.id
                          ? "text-yellow-500 text-xs"
                          : "text-gray-400 text-xs"
                      }
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Product List */}
      <div className="col-span-12 lg:col-span-10 mt-8">
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) :  (
          <div
            className={`grid ${(() => {
              switch (selectedLayout) {
                case "grid-2":
                  return "grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3";
                case "grid-3":
                  return "grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3";
                default:
                  return "grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-3";
              }
            })()}`}
          >
            {filteredProducts?.map((product: any, index: number) => {
              const variation = product.VariationProduct?.[0];
              return (
                <div key={index}>
                  <ProductCard
                    id={product?.productLink}
                    image={product?.ProductImage?.[0]?.imageUrl}
                    title={product.productName}
                    stock={product?.stock || 0}
                    description={
                      product.description || "No description available"
                    }
                    product={product}
                    reviews={product.reviews || 0}
                    reviewCount={product.reviews || 0}
                    discountPrice={variation?.discountPrice || 0}
                    originalPrice={variation?.price || 0} // Showing original price as line-through
                    discountPercentage={product.discountPercentage || 0}
                    category={product.category}
                    brand={product.brand || undefined}
                    highlightText={product.highlightText}
                    subCategory={product.subCategory}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterNav;
