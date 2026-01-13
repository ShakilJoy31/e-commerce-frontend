import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const shippingMethodApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL SHIPPING METHODS
    getShippingMethods: builder.query({
      query: (data) => ({
        url: `/shipping-method/get-shipping-method-all?page=${data?.page || 1}&size=${data?.size || fallback.querySize}&search=${data?.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["shippingMethod"],
    }),

    // GET SINGLE SHIPPING METHOD BY ID
    getSingleShippingMethod: builder.query({
      query: (id) => ({
        url: `/shipping-method/get-shipping-method-by-id/${id}`,
      }),
      providesTags: ["shippingMethod"],
    }),

    // CREATE NEW SHIPPING METHOD
    createShippingMethod: builder.mutation({
      query: (newData) => ({
        url: `/shipping-method/create-shipping-method`,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["shippingMethod"],
    }),

    // UPDATE SHIPPING METHOD
    updateShippingMethod: builder.mutation({
      query: ({ id, data }) => ({
        url: `/shipping-method/update-shipping-method/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["shippingMethod"],
    }),

    // DELETE SHIPPING METHOD
    deleteShippingMethod: builder.mutation({
      query: (id) => ({
        url: `/shipping-method/delete-shipping-method/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["shippingMethod"],
    }),
  }),
});

export const {
  useGetShippingMethodsQuery,
  useGetSingleShippingMethodQuery,
  useCreateShippingMethodMutation,
  useUpdateShippingMethodMutation,
  useDeleteShippingMethodMutation,
} = shippingMethodApi;
