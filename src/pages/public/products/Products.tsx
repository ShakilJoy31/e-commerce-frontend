import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useGetProductsQuery } from "@/components/store/api/products/productApi";
import Heading from "@/components/typography/Heading";
import { Product } from "@/types/product/product";
import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import FilterNav from "./FilterNav";
import SliderSection from "./SliderSection";
import { useLocation, useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const [visiblePages, setVisiblePages] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setVisiblePages(window.innerWidth >= 768 ? 6 : 4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const end = Math.min(totalPages, start + visiblePages - 1);

    if (end - start + 1 < visiblePages) {
      start = Math.max(1, end - visiblePages + 1);
    }

    const pages: (number | string)[] = [];

    if (start > 1) pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      //@ts-ignore
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 lg:p-1.5 rounded border disabled:opacity-50 text-sm sm:text-base hover:bg-gray-50"
        >
          <IoIosArrowBack className="text-xl"/>
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`min-w-[36px] px-2 py-1 rounded border text-sm sm:text-base ${
                page === currentPage
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-gray-50"
              } ${
                typeof page !== "number" && "pointer-events-none cursor-default"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 lg:p-1.5 rounded border disabled:opacity-50 text-sm sm:text-base hover:bg-gray-50"
        >
          <IoIosArrowForward className="text-xl"/>
        </button>
      </div>
    </div>
  );
};

const Products = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryIdNumber = categoryId ? Number(categoryId) : null;
  const { subCategoryId } = useParams<{ subCategoryId: string }>();
  const subCategoryIdNumber = subCategoryId ? Number(subCategoryId) : null;
  const { brandId } = useParams<{ brandId: string }>();
  const brandIdNumber = brandId ? Number(brandId) : null;

  const [products, setProducts] = useState<Product[]>([]);
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

  const {
    data: productsData,
    isLoading: loadingProducts,
    isError,
  } = useGetProductsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchQuery,
    categoryId: categoryIdNumber,
    subCategoryId: subCategoryIdNumber,
    brandId: brandIdNumber,
  }) as any;

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.data);
      setPagination((prev) => ({
        ...prev,
        page: (productsData.meta.page ?? 0) + 1,
        size: productsData.meta.size,
        meta: {
          page: (productsData.meta.page ?? 0) + 1,
          size: productsData.meta.size,
          total: productsData.meta.total,
          totalPage: productsData.meta.totalPage || 1,
          maxPrice: productsData.meta.maxPrice,
          minPrice: productsData.meta.minPrice,
        },
      }));
    }
  }, [productsData]);

  const handleSortChange = (sortOption: string) => {
    let sortedProducts = [...products];
    switch (sortOption) {
      case "price-asc":
        sortedProducts.sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
        );
        break;
      case "price-desc":
        sortedProducts.sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
        );
        break;
      case "rating-desc":
        sortedProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      case "name-asc":
        sortedProducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case "name-desc":
        sortedProducts.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      default:
        sortedProducts = [...(productsData?.data || [])];
    }
    setProducts(sortedProducts);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.meta?.totalPage) {
      setPagination((prev) => ({ ...prev, page }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 1 }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageWrapper className="min-h-screen relative px-2 lg:px-3">
      <SectionWrapper className="pb-[158px] w-full relative">
        <div className="bg-other_bg bg-cover pt-5 pb-[150px]">
          <SectionWrapper className="flex flex-col items-center justify-center">
            <Heading variant="secondary" align="center" className="py-5">
              Shop
            </Heading>
            <h2 className="text-[14px] font-medium flex items-center">
              Home{" "}
              <span className="px-2">
                <MdArrowForwardIos />
              </span>{" "}
              Shop
            </h2>
          </SectionWrapper>
        </div>
      </SectionWrapper>

      <SectionWrapper className="absolute top-64 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full">
        <SliderSection />
      </SectionWrapper>

      <SectionWrapper className="-mt-16 lg:-mt-28">
        {!isError && (
          <FilterNav
            onSortChange={handleSortChange}
            products={products}
            pagination={pagination}
            isLoadingProducts={loadingProducts}
            categoryIdNumber={categoryIdNumber}
            subCategoryIdNumber={subCategoryIdNumber}
            brandIdNumber={brandIdNumber}
            searchQuery={searchQuery}
            page={pagination?.page}
            size={pagination?.size}
          />
        )}

        <div className="my-10 px-2 lg:px-4">
          <Pagination
            totalPages={pagination.meta.totalPage}
            currentPage={pagination.page}
            // @ts-ignore
            itemsPerPage={pagination.size} 
            onPageChange={handlePageChange}
            onItemsPerPageChange={handlePageSizeChange}
          />
        </div>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default Products;
