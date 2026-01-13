import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const newArrivalProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD NEW ARRIVAL PRODUCT
    addNewArrivalProduct: builder.mutation({
      query: (data) => ({
        url: "/new-arrival/create-new-arrival-product-show",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["newArrivalProduct"],
    }),

    // GET ALL NEW ARRIVAL PRODUCTS
    getNewArrivalProducts: builder.query({
      query: (data) => ({
        url: `/new-arrival/get-new-arrival-product-show-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["newArrivalProduct"],
    }),

    // GET NEW ARRIVAL PRODUCTS FOR HOME PAGE
    getNewArrivalProductsHome: builder.query({
      query: (data) => ({
        url: `/new-arrival/get-new-arrival-product-show-home-page?arrivalId=${data?.arrivalId || 0}`,
      }),
      providesTags: ["newArrivalProduct"],
    }),

    // GET SINGLE NEW ARRIVAL PRODUCT
    getSingleNewArrivalProduct: builder.query({
      query: (id) => ({
        url: `/new-arrival/get-new-arrival-product-show-by-id/${id}`,
      }),
      providesTags: ["newArrivalProduct"],
    }),

    // UPDATE NEW ARRIVAL PRODUCT
    updateNewArrivalProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/new-arrival/update-new-arrival-product-show/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["newArrivalProduct"],
    }),

    // DELETE NEW ARRIVAL PRODUCT
    deleteNewArrivalProduct: builder.mutation({
      query: (id) => ({
        url: `/new-arrival/delete-new-arrival-product-show/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["newArrivalProduct"],
    }),
  }),
});

export const {
  useAddNewArrivalProductMutation,
  useDeleteNewArrivalProductMutation,
  useGetNewArrivalProductsQuery,
  useGetSingleNewArrivalProductQuery,
  useUpdateNewArrivalProductMutation,
  useGetNewArrivalProductsHomeQuery,
} = newArrivalProductApi;
