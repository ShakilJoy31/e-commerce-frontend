import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const customers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CUSTOMERS
    getCustomers: builder.query({
      query: (data) => ({
        url: `/user/get-customer-all?page=${data?.page || 1}&size=${data?.size || fallback.querySize}&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["customers"],
    }),

    // GET SINGLE CUSTOMER
    getSingleCustomer: builder.query({
      query: (id) => ({
        url: `/user/get-customer-by-id/${id}`,
      }),
      providesTags: ["customers"],
    }),

     addSmMessage: builder.mutation({
      query: (data) => ({
        url: "/dashboard/sms-marketing",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["customers"],
    }),

  }),
});

export const {
  useGetCustomersQuery,
  useGetSingleCustomerQuery,
  useAddSmMessageMutation,
} = customers;
