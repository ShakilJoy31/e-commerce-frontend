import ProductCard from "@/components/common/card/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaStar, FaTimes } from "react-icons/fa";

const MobileFilterNav = ({ products }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    sizes: true,
    colors: true,
    ratings: true,
    price: true,
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

  const [filteredProducts, setFilteredProducts] = useState(products);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const applyFilters = () => {
    const filtered = products?.filter((product) => {
      return (
        (!selectedCategories.length ||
          selectedCategories.includes(product.categoryId)) &&
        (!selectedBrands.length || selectedBrands.includes(product.brandId)) &&
        (!selectedSizes.length || selectedSizes.includes(product.sizeId)) &&
        (!selectedColors.length || selectedColors.includes(product.colorId)) &&
        (!selectedRatings.length ||
          selectedRatings.includes(Math.round(product.rating || 0))) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
      );
    });
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [
    selectedCategories,
    selectedBrands,
    selectedSizes,
    selectedColors,
    selectedRatings,
    priceRange,
    products,
  ]);

  return (
    <>
      {/* Filter Toggle Button */}
      <div className="fixed bottom-4 right-20 z-50 md:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg"
        >
          Show Filters
        </button>
      </div>

      {/* Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4 shadow-lg overflow-y-auto">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-500"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Categories */}
          <div className="my-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("categories")}
            >
              <h3 className="text-md font-semibold">Categories</h3>
              {expandedSections.categories ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {expandedSections.categories && (
              <div className="mt-3">
                {[1, 2, 3].map((categoryId) => (
                  <div
                    key={categoryId}
                    className="flex items-center gap-2 mb-2"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(categoryId)}
                      onCheckedChange={() =>
                        setSelectedCategories((prev) =>
                          prev.includes(categoryId)
                            ? prev.filter((id) => id !== categoryId)
                            : [...prev, categoryId]
                        )
                      }
                    />
                    <span>Category {categoryId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="my-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("brands")}
            >
              <h3 className="text-md font-semibold">Brands</h3>
              {expandedSections.brands ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {expandedSections.brands && (
              <div className="mt-3">
                {[1, 2].map((brandId) => (
                  <div key={brandId} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={selectedBrands.includes(brandId)}
                      onCheckedChange={() =>
                        setSelectedBrands((prev) =>
                          prev.includes(brandId)
                            ? prev.filter((id) => id !== brandId)
                            : [...prev, brandId]
                        )
                      }
                    />
                    <span>Brand {brandId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="my-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("sizes")}
            >
              <h3 className="text-md font-semibold">Sizes</h3>
              {expandedSections.sizes ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {expandedSections.sizes && (
              <div className="mt-3">
                {[1, 2, 3].map((sizeId) => (
                  <div key={sizeId} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={selectedSizes.includes(sizeId)}
                      onCheckedChange={() =>
                        setSelectedSizes((prev) =>
                          prev.includes(sizeId)
                            ? prev.filter((id) => id !== sizeId)
                            : [...prev, sizeId]
                        )
                      }
                    />
                    <span>Size {sizeId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="my-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("colors")}
            >
              <h3 className="text-md font-semibold">Colors</h3>
              {expandedSections.colors ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {expandedSections.colors && (
              <div className="mt-3">
                {[1, 2, 3].map((colorId) => (
                  <div key={colorId} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={selectedColors.includes(colorId)}
                      onCheckedChange={() =>
                        setSelectedColors((prev) =>
                          prev.includes(colorId)
                            ? prev.filter((id) => id !== colorId)
                            : [...prev, colorId]
                        )
                      }
                    />
                    <span>Color {colorId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ratings */}
          <div className="my-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("ratings")}
            >
              <h3 className="text-md font-semibold">Ratings</h3>
              {expandedSections.ratings ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {expandedSections.ratings && (
              <div className="mt-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={selectedRatings.includes(rating)}
                      onCheckedChange={() =>
                        setSelectedRatings((prev) =>
                          prev.includes(rating)
                            ? prev.filter((id) => id !== rating)
                            : [...prev, rating]
                        )
                      }
                    />
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`text-xs ${
                            index < rating ? "text-yellow-500" : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="my-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("price")}
            >
              <h3 className="text-md font-semibold">Price Range</h3>
              {expandedSections.price ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            {expandedSections.price && (
              <div className="mt-3">
                <Slider
                  range
                  min={0}
                  max={1000}
                  value={priceRange}
                  onChange={(value: any) => setPriceRange(value)}
                  trackStyle={[{ backgroundColor: "#2563eb", height: 5 }]}
                  handleStyle={[
                    { backgroundColor: "#2563eb", border: "none" },
                    { backgroundColor: "#2563eb", border: "none" },
                  ]}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>৳ {priceRange[0]}</span>
                  <span>৳ {priceRange[1]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {filteredProducts?.map((product, index) => (
          <ProductCard
            key={index}
            id={product.id}
            image={product?.ProductImage?.[0]?.imageUrl}
            title={product.productName}
            description={product.description || "No description available"}
            product={product}
            reviews={product.reviews || 0}
            reviewCount={product.reviews || 0}
            discountPrice={product.discountPrice || 0}
            originalPrice={product.price || 0}
            discountPercentage={product.discountPercentage || 0}
            category={product.category}
            stock={product.stock || undefined}
            brand={product.brand || undefined}
            subCategory={product.subCategory}
          />
        ))}
      </div>
    </>
  );
};

export default MobileFilterNav;
