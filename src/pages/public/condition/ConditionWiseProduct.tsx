import { useState, useEffect } from "react";
import { useGetProductsConditionWiseQuery } from "@/components/store/api/products/productApi";
import { useParams } from "react-router-dom";
import ProductCard from "@/components/common/card/ProductCard";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import Slider from "rc-slider";
import Pagination from "@/components/ui/pagination";

const ConditionWiseProduct = () => {
  const { id } = useParams<{ id: string }>();

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
  const { data: conditionWiseProducts, isLoading: ProductLoading } =
    useGetProductsConditionWiseQuery({
      id,
      sort: pagination.sort,
      page: pagination.page,
      size: pagination.size,
    });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outStockOnly, setOutStockOnly] = useState(false);

  useEffect(() => {
    if (conditionWiseProducts) {
      setPagination((prev) => ({
        ...prev,
        page: (conditionWiseProducts.meta.page ?? 0) + 1, // ✅ Ensure page is 1-based
        size: conditionWiseProducts.meta.size, // ✅ Keep API-provided size
        meta: {
          page: (conditionWiseProducts.meta.page ?? 0) + 1, // ✅ Ensure 1-based
          size: conditionWiseProducts.meta.size,
          total: conditionWiseProducts.meta.total,
          totalPage: conditionWiseProducts.meta.totalPage || 1, // ✅ Ensure there's at least 1 page
          maxPrice: conditionWiseProducts.meta.maxPrice,
          minPrice: conditionWiseProducts.meta.minPrice,
        },
      }));
    }
  }, [conditionWiseProducts]);

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value as [number, number]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (!conditionWiseProducts || conditionWiseProducts.data.length === 0) {
    return <p className="min-h-screen text-center mt-10 font-bold text-xl text-primary animate-pulse">No products found</p>;
  }

  return (
    <section className="max-w-[1650px] mx-auto px-3 min-h-screen">
      <div className=" flex items-start border-t">
        {/* Sidebar for Filters */}
        <div className="w-[15%] p-4">
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
        <div className="w-[85%] p-4 border-l">
          <div className="flex items-center justify-between mt-5 bg-gray-100 p-4 rounded-md shadow-md">
            <p className="text-xl font-semibold text-primary">
              {conditionWiseProducts.data[0]?.brand?.brand}
            </p>
            <p>
              {pagination?.meta?.total}{" "}
              {(pagination?.meta?.total ?? 0) > 1 ? "items" : "item"} found in{" "}
              {conditionWiseProducts?.data?.[0]?.brand?.brand}
            </p>
          </div>

          {/* Product Grid */}
          {conditionWiseProducts?.data.length === 0 ? (
            <p className="text-center mt-16 text-gray-500 text-lg min-h-screen">
              No products found
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 my-10">
              {conditionWiseProducts?.data?.map((product: any) => {
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
              totalPages={pagination.meta.totalPage}
              currentPage={pagination.page}
              itemsPerPage={pagination.size} 
              onPageChange={handlePageChange}
              onItemsPerPageChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConditionWiseProduct;
