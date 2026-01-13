import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const categoryWiseProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD CATEGORY-WISE PRODUCT
    addCategoryWiseProduct: builder.mutation({
      query: (data) => ({
        url: "/category-wise/create-category-wise-product-show",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categoryWiseProduct"],
    }),
    // GET ALL CATEGORY-WISE PRODUCTS
    getCategoryWiseProducts: builder.query({
      query: (data) => ({
        url: `/category-wise/get-category-wise-product-show-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["categoryWiseProduct"],
    }),
    getCategoryWiseProductsHome: builder.query({
      query: (data) => ({
        url: `/category-wise/get-category-wise-product-show-home-page?subCategoryId=${data?.subCategoryId || 0}`,
      }),
      providesTags: ["categoryWiseProduct"],
    }),
    // GET SINGLE CATEGORY-WISE PRODUCT
    getSingleCategoryWiseProduct: builder.query({
      query: (id) => ({
        url: `/category-wise/get-category-wise-product-show-by-id/${id}`,
      }),
      providesTags: ["categoryWiseProduct"],
    }),
    // UPDATE CATEGORY-WISE PRODUCT
    updateCategoryWiseProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category-wise/update-category-wise-product-show/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categoryWiseProduct"],
    }),
    // DELETE CATEGORY-WISE PRODUCT
    deleteCategoryWiseProduct: builder.mutation({
      query: (id) => ({
        url: `/category-wise/delete-category-wise-product-show/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categoryWiseProduct"],
    }),
  }),
});

export const {
  useAddCategoryWiseProductMutation,
  useDeleteCategoryWiseProductMutation,
  useGetCategoryWiseProductsQuery,
  useGetSingleCategoryWiseProductQuery,
  useUpdateCategoryWiseProductMutation,
  useGetCategoryWiseProductsHomeQuery,
} = categoryWiseProductApi;