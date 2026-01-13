import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const dealWiseProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD DEAL-WISE PRODUCT
    addDealWiseProduct: builder.mutation({
      query: (data) => ({
        url: "/deal-wise/create-deal-wise-product-show",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dealProduct"],
    }),

    // GET ALL DEAL-WISE PRODUCTS
    getDealWiseProducts: builder.query({
      query: (data) => ({
        url: `/deal-wise/get-deal-wise-product-show-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["dealProduct"],
    }),

    // GET DEAL-WISE PRODUCTS FOR HOME PAGE
    getDealWiseProductsHome: builder.query({
      query: (data) => ({
        url: `/deal-wise/get-deal-wise-product-show-home-page?dealId=${data?.dealId || 0}`,
      }),
      providesTags: ["dealProduct"],
    }),

    // GET SINGLE DEAL-WISE PRODUCT
    getSingleDealWiseProduct: builder.query({
      query: (id) => ({
        url: `/deal-wise/get-deal-wise-product-show-by-id/${id}`,
      }),
      providesTags: ["dealProduct"],
    }),

    // UPDATE DEAL-WISE PRODUCT
    updateDealWiseProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/deal-wise/update-deal-wise-product-show/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["dealProduct"],
    }),

    // DELETE DEAL-WISE PRODUCT
    deleteDealWiseProduct: builder.mutation({
      query: (id) => ({
        url: `/deal-wise/delete-deal-wise-product-show/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["dealProduct"],
    }),

     // GET ALL DEAL-WISE PRODUCTS
    getDealWiseSaleProducts: builder.query({
      query: (data) => ({
        url: `/deal-wise/get-deal-wise-product-show-home-page?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["dealProduct"],
    }),

  }),
});

export const {
  useAddDealWiseProductMutation,
  useDeleteDealWiseProductMutation,
  useGetDealWiseProductsQuery,
  useGetSingleDealWiseProductQuery,
  useUpdateDealWiseProductMutation,
  useGetDealWiseProductsHomeQuery,
  useGetDealWiseSaleProductsQuery,
} = dealWiseProductApi;
