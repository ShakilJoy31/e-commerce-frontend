import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const popularProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD POPULAR PRODUCT
    addPopularProduct: builder.mutation({
      query: (data) => ({
        url: "/popular-product/create-popular-product-show",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["popularProduct"],
    }),

    // GET ALL POPULAR PRODUCTS
    getPopularProducts: builder.query({
      query: (data) => ({
        url: `/popular-product/get-popular-product-show-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data?.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["popularProduct"],
    }),

    // GET POPULAR PRODUCTS FOR HOME PAGE
    getPopularProductsHome: builder.query({
      query: (data) => ({
        url: `/popular-product/get-popular-product-show-home-page?popularId=${data?.popularId || 0}`,
      }),
      providesTags: ["popularProduct"],
    }),

    // GET SINGLE POPULAR PRODUCT
    getSinglePopularProduct: builder.query({
      query: (id) => ({
        url: `/popular-product/get-popular-product-show-by-id/${id}`,
      }),
      providesTags: ["popularProduct"],
    }),

    // UPDATE POPULAR PRODUCT
    updatePopularProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/popular-product/update-popular-product-show/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["popularProduct"],
    }),

    // DELETE POPULAR PRODUCT
    deletePopularProduct: builder.mutation({
      query: (id) => ({
        url: `/popular-product/delete-popular-product-show/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["popularProduct"],
    }),
  }),
});

export const {
  useAddPopularProductMutation,
  useDeletePopularProductMutation,
  useGetPopularProductsQuery,
  useGetSinglePopularProductQuery,
  useUpdatePopularProductMutation,
  useGetPopularProductsHomeQuery,
} = popularProductApi;
