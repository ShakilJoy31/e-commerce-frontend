import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const brandWiseProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD BRAND-WISE PRODUCT
    addBrandWiseProduct: builder.mutation({
      query: (data) => ({
        url: "/brand-wise/create-brand-wise-product-show",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["brandWiseProduct"],
    }),

    // GET ALL BRAND-WISE PRODUCTS
    getBrandWiseProducts: builder.query({
      query: (data) => ({
        url: `/brand-wise/get-brand-wise-product-show-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["brandWiseProduct"],
    }),

    // GET BRAND-WISE PRODUCTS FOR HOME PAGE
    getBrandWiseProductsHome: builder.query({
      query: (data) => ({
        url: `/brand-wise/get-brand-wise-product-show-home-page?brandId=${data?.brandId || 0}`,
      }),
      providesTags: ["brandWiseProduct"],
    }),

    // GET SINGLE BRAND-WISE PRODUCT
    getSingleBrandWiseProduct: builder.query({
      query: (id) => ({
        url: `/brand-wise/get-brand-wise-product-show-by-id/${id}`,
      }),
      providesTags: ["brandWiseProduct"],
    }),

    // UPDATE BRAND-WISE PRODUCT
    updateBrandWiseProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brand-wise/update-brand-wise-product-show/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["brandWiseProduct"],
    }),

    // DELETE BRAND-WISE PRODUCT
    deleteBrandWiseProduct: builder.mutation({
      query: (id) => ({
        url: `/brand-wise/delete-brand-wise-product-show/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brandWiseProduct"],
    }),
  }),
});

export const {
  useAddBrandWiseProductMutation,
  useDeleteBrandWiseProductMutation,
  useGetBrandWiseProductsQuery,
  useGetSingleBrandWiseProductQuery,
  useUpdateBrandWiseProductMutation,
  useGetBrandWiseProductsHomeQuery,
} = brandWiseProductApi;
