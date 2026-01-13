import ProductCard from "@/components/common/card/ProductCard";
import Pagination from "@/components/ui/pagination";
import ProductCardSkeleton from "@/components/common/skeleton/ProductCardSkeleton";
import { useGetProductsTagWiseQuery } from "@/components/store/api/products/productApi";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import axios from "axios";

const TagWiseProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
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

  const { data: tags, isLoading } = useGetProductsTagWiseQuery({
    id,
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
  });

  const [filteredProducts, setFilteredProducts] = useState<any>(tags?.data);

  // Fetch product data when tags change
  useEffect(() => {
    if (tags) {
      setPagination((prev) => ({
        ...prev,
        page: (tags.meta.page ?? 0) + 1,
        size: tags.meta.size,
        meta: {
          page: (tags.meta.page ?? 0) + 1,
          size: tags.meta.size,
          total: tags.meta.total,
          totalPage: tags.meta.totalPage || 1,
          maxPrice: tags.meta.maxPrice,
          minPrice: tags.meta.minPrice,
        },
      }));
      setMinPrice(tags.meta.minPrice || 0);
      setMaxPrice(tags.meta.maxPrice || 100000);
      setPriceRange([tags.meta.minPrice || 0, tags.meta.maxPrice || 100000]);
    }
  }, [tags]);

  const fetchFilteredProducts = useCallback(async () => {
    try {
      const payload: any = {
        page: pagination.page,
        perPage: pagination.size,
        minPrice: priceRange[0] > minPrice ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < maxPrice ? priceRange[1] : undefined,
      };

      const response = await axios.post(
        "https://e-commerce-tech-elemet-bd.vercel.app/api/v1/product/get-products-wite-filter",
        payload
      );
      setFilteredProducts(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch filtered products:", error);
      setFilteredProducts([]);
    }
  }, [priceRange, minPrice, maxPrice, pagination.page, pagination.size]);

  const isFilterApplied =
    priceRange[0] !== minPrice || priceRange[1] !== maxPrice;

  useEffect(() => {
    if (isFilterApplied) {
      fetchFilteredProducts();
    } else {
      setFilteredProducts(tags?.data);
    }
  }, [fetchFilteredProducts, isFilterApplied, priceRange, tags?.data]);

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value as [number, number]);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.meta?.totalPage) {
      setPagination((prev) => ({
        ...prev,
        page,
      }));
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({
      ...prev,
      size: newSize,
      page: 1,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 m-5 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!tags || tags.data.length === 0) {
    return (
      <p className="min-h-screen text-center mt-10 font-bold text-xl text-primary animate-pulse">
        No products found
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start border-t">
      {/* Sidebar for Filters */}
      <div className="w-11/12 lg:w-[15%] p-4">
        {/* Price Filter */}
        <div className="mb-5">
          <h4 className="text-lg font-semibold pb-2">Price</h4>
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

      {/* Main Content */}
      <div className="w-full lg:w-[85%] p-2 lg:p-4 border-none lg:border-l">
        <div className="flex items-center justify-between mt-5 bg-gray-100 p-4 rounded-md shadow-md">
          <p className="text-xl font-semibold text-primary">{tags.data[0]?.tag}</p>
          <p>
            {pagination?.meta?.total}{" "}
            {(pagination?.meta?.total ?? 0) > 1 ? "items" : "item"} found in{" "}
            {tags.data[0]?.tag}
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts?.length === 0 ? (
          <p className="text-center mt-16 text-gray-500 text-lg min-h-screen">
            No products found
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 my-10">
            {filteredProducts?.length> 0 && filteredProducts?.map((product: any) => {
              const variation = product.VariationProduct?.[0];
              return (
                <ProductCard
                  key={product.productLink}
                  id={product.productLink}
                  image={product?.ProductImage?.[0]?.imageUrl}
                  title={product.productName}
                  stock={product?.stock || 0}
                  description={product.description || "No description available"}
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
  );
};

export default TagWiseProduct;
