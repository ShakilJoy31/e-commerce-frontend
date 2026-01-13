import { useState, useEffect, useMemo } from "react";
import { useGetProductsCategoryWiseQuery } from "@/components/store/api/products/productApi";
import { useParams } from "react-router-dom";
import ProductCard from "@/components/common/card/ProductCard";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import Slider from "rc-slider";
import DOMPurify from "dompurify";
import Pagination from "@/components/ui/pagination";

const CategoryWiseProduct = () => {
  const { id } = useParams<{ id: string }>();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const [inStockOnly, setInStockOnly] = useState(false);
  const [outStockOnly, setOutStockOnly] = useState(false);
  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: null,
      size: null,
      total: null,
      totalPage: 1,
      maxPrice: null,
      minPrice: null,
    },
  });
  const { data: categoryWiseProducts, isLoading: ProductLoading } =
    useGetProductsCategoryWiseQuery({
      id,
      sort: pagination.sort,
      page: pagination.page,
      size: pagination.size,
    });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  useEffect(() => {
    if (categoryWiseProducts?.meta) {
      setPriceRange([
        categoryWiseProducts.meta.minPrice || 0,
        categoryWiseProducts.meta.maxPrice || 100000,
      ]);
    }
  }, [categoryWiseProducts]);

  const sanitizedDescription = DOMPurify.sanitize(
    categoryWiseProducts?.data[0]?.category?.description
  );

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
    if (categoryWiseProducts) {
      setPagination((prev) => ({
        ...prev,
        page: (categoryWiseProducts.meta.page ?? 0) + 1, // ✅ Ensure page is 1-based
        size: categoryWiseProducts.meta.size, // ✅ Keep API-provided size
        meta: {
          page: (categoryWiseProducts.meta.page ?? 0) + 1, // ✅ Ensure 1-based
          size: categoryWiseProducts.meta.size,
          total: categoryWiseProducts.meta.total,
          totalPage: categoryWiseProducts.meta.totalPage || 1, // ✅ Ensure there's at least 1 page
          maxPrice: categoryWiseProducts.meta.maxPrice,
          minPrice: categoryWiseProducts.meta.minPrice,
        },
      }));
    }
  }, [categoryWiseProducts]);

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value as [number, number]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = useMemo(() => {
    return categoryWiseProducts?.data?.filter((product: any) => {
      const productPrice =
        product.VariationProduct?.[0]?.discountPrice ||
        product.VariationProduct?.[0]?.price ||
        0;
      const productSubCategory = product.subCategory?.[0]?.subCategory?.name;

      return (
        (!selectedSubCategory || productSubCategory === selectedSubCategory) &&
        productPrice >= priceRange[0] &&
        productPrice <= priceRange[1] &&
        (!inStockOnly || product.stock > 0) &&
        (!outStockOnly || product.stock <= 0)
      );
    });
  }, [
    categoryWiseProducts?.data,
    selectedSubCategory,
    priceRange,
    inStockOnly,
    outStockOnly,
  ]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.meta?.totalPage) {
      setPagination((prev) => ({
        ...prev,
        page,
      }));
    }
  };

  // Handle page size change (items per page)
  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({
      ...prev,
      size: newSize,
      page: 1,
    }));
  };

  if (ProductLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 m-5 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!categoryWiseProducts || categoryWiseProducts.data.length === 0) {
    return (
      <p className="min-h-screen text-center mt-10 font-bold text-xl text-primary animate-pulse">
        No products found
      </p>
    );
  }

  return (
    <section className="max-w-[1650px] mx-auto px-3 min-h-screen">
      {categoryWiseProducts?.data[0]?.category?.banner && (
        <img
          src={categoryWiseProducts?.data[0]?.category?.banner}
          alt={
            categoryWiseProducts?.data[0]?.category?.createdAt || "Banner image"
          }
          className="w-full h-[40vh] lg:h-[60vh]"
        />
      )}

      {/* Subcategories */}
      <div className="flex gap-3 py-10 overflow-x-auto">
        <button
          onClick={() => setSelectedSubCategory(null)}
          className={`px-4 py-1 lg:py-2 rounded-md shadow-md font-medium whitespace-nowrap flex-shrink-0 ${
            selectedSubCategory === null
              ? "bg-primary text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>
        {categoryWiseProducts?.subCategories?.map((subCategory: any) => (
          <button
            key={subCategory.id}
            onClick={() => setSelectedSubCategory(subCategory.name)}
            className={`px-4 py-1 lg:py-2 rounded-md shadow-md font-medium whitespace-nowrap flex-shrink-0 ${
              selectedSubCategory === subCategory.name
                ? "bg-primary text-white"
                : "bg-gray-200"
            }`}
          >
            {subCategory.name}
          </button>
        ))}
      </div>
      <div className=" flex flex-col lg:flex-row items-start border-t">
        {/* Sidebar for Filters */}
        <div className="w-11/12 lg:w-[15%] p-4">
          {/* Price Filter */}
          <div className="mb-5">
            <h4 className="text-lg font-semibold pb-2">Price</h4>
            <Slider
              range
              min={pagination?.meta?.minPrice ?? 0}
              max={pagination?.meta?.maxPrice ?? 0}
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

          {/* Availability Filter */}
          <div>
            <h4 className="text-lg font-thin">Availability</h4>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In Stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={outStockOnly}
                  onChange={(e) => setOutStockOnly(e.target.checked)}
                />
                Out of Stock
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-[85%] p-2 lg:p-4 border-none lg:border-l">
          <div className="flex items-center justify-between mt-5 bg-gray-100 p-4 rounded-md shadow-md">
            <p className="text-xl font-semibold text-primary">
              {categoryWiseProducts.data[0]?.category?.name}
            </p>
            <p>
              {pagination?.meta?.total}{" "}
              {(pagination?.meta?.total ?? 0) > 1 ? "items" : "item"} found in{" "}
              {categoryWiseProducts.data[0]?.category?.name}
            </p>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <p className="text-center mt-16 text-gray-500 text-lg min-h-screen">
              No products found
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 my-10">
              {filteredProducts.map((product: any) => {
                const variation = product.VariationProduct?.[0];
                return (
                  <ProductCard
                    key={product.productLink}
                    id={product.productLink}
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
                    originalPrice={variation?.price || 0}
                    discountPercentage={product.discountPercentage || 0}
                    brand={product.brand || undefined}
                    category={product.category}
                    highlightText={product.highlightText}
                    subCategory={product.subCategory}
                  />
                );
              })}
            </div>
          )}

          <div className="my-10">
            <Pagination
              totalPages={pagination.meta.totalPage || 1}
              currentPage={pagination.page}
              itemsPerPage={pagination.size} // Changed to match interface
              onPageChange={handlePageChange}
              onItemsPerPageChange={handlePageSizeChange}
            />
          </div>

          <div className="pb-10">
            <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: filteredContent }}
                className="w-full [&_img]:w-full [&_img]:h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryWiseProduct;
