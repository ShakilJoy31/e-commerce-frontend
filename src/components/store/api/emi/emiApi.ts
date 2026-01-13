import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const emiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD EMI PLAN
    addEmi: builder.mutation({
      query: (data) => ({
        url: "/emi-charge/create-emi-charge",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["emi"],
    }),
    // GET ALL EMI PLANS
    getEmis: builder.query({
      query: (data) => ({
        url: `/emi-charge/get-emi-charge-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["emi"],
    }),
    // GET SINGLE EMI PLAN
    getSingleEmi: builder.query({
      query: (id) => ({
        url: `/emi-charge/get-emi-charge-by-id/${id}`,
      }),
      providesTags: ["emi"],
    }),
    // UPDATE EMI PLAN
    updateEmi: builder.mutation({
      query: ({ id, data }) => ({
        url: `/emi-charge/update-emi-charge/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["emi"],
    }),
    // DELETE EMI PLAN
    deleteEmi: builder.mutation({
      query: (id) => ({
        url: `/emi-charge/delete-emi-charge/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["emi"],
    }),
  }),
});

export const {
  useAddEmiMutation,
  useDeleteEmiMutation,
  useGetEmisQuery,
  useGetSingleEmiQuery,
  useUpdateEmiMutation,
} = emiApi;