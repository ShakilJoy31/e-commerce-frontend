import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const bankApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD BANK
    addBank: builder.mutation({
      query: (data) => ({
        url: "/bank/create-bank",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bank"],
    }),
    // GET ALL BANKS
    getBanks: builder.query({
      query: (data) => ({
        url: `/bank/get-bank-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["bank"],
    }),
    // GET SINGLE BANK
    getSingleBank: builder.query({
      query: (id) => ({
        url: `/bank/get-bank-by-id/${id}`,
      }),
      providesTags: ["bank"],
    }),
    // UPDATE BANK
    updateBank: builder.mutation({
      query: ({ id, data }) => ({
        url: `/bank/update-bank/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["bank"],
    }),
    // DELETE BANK
    deleteBank: builder.mutation({
      query: (id) => ({
        url: `/bank/delete-bank/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["bank"],
    }),
  }),
});

export const {
  useAddBankMutation,
  useDeleteBankMutation,
  useGetBanksQuery,
  useGetSingleBankQuery,
  useUpdateBankMutation,
} = bankApi;
