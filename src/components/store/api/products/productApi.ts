import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD PRODUCT
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/product/create-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
     uploadExcel: builder.mutation<void, { products: any[] }>({
      query: (body) => ({
        url: "/product/create-many-product",
        method: "POST",
        body,
      }),
    }),
    // GET ALL PRODUCT
    getProducts: builder.query({
      query: (data) => ({
        url: `/product/get-products?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}&type=${
          data?.type || "Published"
        }`,
      }),
      providesTags: ["products"],
    }),
    getSearchProducts: builder.query({
      query: (data) => ({
        url: `/product/get-product-search?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}&type=${
          data?.type || "Published"
        }`,
      }),
      providesTags: ["products"],
    }),
    getUpcomingProducts: builder.query({
      query: (data) => ({
        url: `/product/get-upcoming-products?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}&type=${
          data?.type || "Published"
        }`,
      }),
      providesTags: ["products"],
    }),
    getProductsGallery: builder.query({
      query: (data) => ({
        url: `/product/get-image-gallery?search=${data.search || ""}`,
      }),
      providesTags: ["products"],
    }),
    getProductsByFilter: builder.query({
      query: (data) => ({
        url: `/product/get-products-wite-filter?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&sortOrder=${data?.sort || "asc"}&type=${
          data?.type || "All"
        }`,
      }),
      providesTags: ["products"],
    }),
    getProductsNewArival: builder.query({
      query: () => ({
        url: `/product/get-products-new-arrivals`,
      }),
      providesTags: ["products"],
    }),
    getProductsTopSale: builder.query({
      query: () => ({
        url: `/product/get-popular-products`,
      }),
      providesTags: ["products"],
    }),
    getProductsCategory: builder.query({
      query: () => ({
        url: `/product/get-products-category-wise`,
      }),
      providesTags: ["products"],
    }),
    getProductsCategoryWise: builder.query({
      query: (data) => ({
        url: `/product/get-category-wise-products/${data?.id}?page=${
          data?.page || 1
        }&size=${data?.size || fallback.querySize}&sortOrder=${
          data?.sort || "asc"
        }`,
      }),
      providesTags: ["products"],
    }),
    getProductsBrandWise: builder.query({
      query: (data) => ({
        url: `/product/get-brand-wise-products/${data?.id}?page=${
          data?.page || 1
        }&size=${data?.size || fallback.querySize}&sortOrder=${
          data?.sort || "asc"
        }`,
      }),
      providesTags: ["products"],
    }),
    getProductsSubCategoryWise: builder.query({
      query: (data) => ({
        url: `/product/get-sub-category-wise-products/${data?.id}?page=${
          data?.page || 1
        }&size=${data?.size || fallback.querySize}&sortOrder=${
          data?.sort || "asc"
        }`,
      }),
      providesTags: ["products"],
    }),
    getProductsTagWise: builder.query({
      query: (data) => ({
        url: `/product/get-tag-products/${data?.id}?page=${
          data?.page || 1
        }&size=${data?.size || fallback.querySize}&sortOrder=${
          data?.sort || "asc"
        }`,
      }),
      providesTags: ["products"],
    }),
    getProductsFeatureWise: builder.query({
      query: (data) => ({
        url: `/product/get-feature-wise-products/${data?.id}?page=${
          data?.page || 1
        }&size=${data?.size || fallback.querySize}&sortOrder=${
          data?.sort || "asc"
        }`,
      }),
      providesTags: ["products"],
    }),
    getProductsConditionWise: builder.query({
      query: (data) => ({
        url: `/product/get-condition-wise-products/${data?.id}?page=${
          data?.page || 1
        }&size=${data?.size || fallback.querySize}&sortOrder=${
          data?.sort || "asc"
        }`,
      }),
      providesTags: ["products"],
    }),
    // GET SINGLE PRODUCT
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/product/get-product-by-id/${id}`,
      }),
      providesTags: ["products"],
    }),
    getEditSingleProduct: builder.query({
      query: (id) => ({
        url: `/product/edit-get-product/${id}`,
      }),
      providesTags: ["products"],
    }),
    // SEARCH SINGLE PRODUCT
    searchSingleProduct: builder.query({
      query: (search) => ({
        url: `/product/get-product-single?search=${search}`,
      }),
      providesTags: ["products"],
    }),
    // UPDATE PRODUCT
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/update-product/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
    updateBulkProduct: builder.mutation({
      query: (data) => ({
        url: `/product/update-product-bulk-action`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
    updateProductPrice: builder.mutation({
      query: (data) => ({
        url: `/product/update-product-price`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
    // DELETE PRODUCT
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    deleteProductPermanent: builder.mutation({
      query: (id) => ({
        url: `/product/delete-product-permanent/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
  
    deleteVariation: builder.mutation({
      query: ({ id, type }) => ({
        url: `/product/delete-variation/${id}?type=${type}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    
    
    deleteProductMany: builder.mutation({
      query: (data) => ({
        url: `/product/delete-many-product`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useGetSingleProductQuery,
  useSearchSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsNewArivalQuery,
  useGetProductsCategoryQuery,
  useGetProductsTopSaleQuery,
  useDeleteProductManyMutation,
  useUpdateBulkProductMutation,
  useUpdateProductPriceMutation,
  useGetProductsCategoryWiseQuery,
  useGetProductsBrandWiseQuery,
  useGetProductsByFilterQuery,
  useGetProductsConditionWiseQuery,
  useGetProductsFeatureWiseQuery,
  useGetProductsSubCategoryWiseQuery,
  useGetEditSingleProductQuery,
  useGetProductsGalleryQuery,
  useGetProductsTagWiseQuery,
  useDeleteVariationMutation,
  useUploadExcelMutation,
  useDeleteProductPermanentMutation,
  useGetUpcomingProductsQuery,
  useGetSearchProductsQuery
} = productApi;
