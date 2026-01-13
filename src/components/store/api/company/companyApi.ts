import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD COLOR
    addCompany: builder.mutation({
      query: (data) => ({
        url: "/company-info/create-company-info",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["company"],
    }),
    // GET ALL COLOR
    getCompanyInfoAll: builder.query({
      query: (data) => ({
        url: `/company-info/get-company-info-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["company"],
    }),
    // GET SINGLE COLOR
    getSingleCompany: builder.query({
      query: (id) => ({
        url: `/company-info/get-company-info-by-id/${id}`,
      }),
      providesTags: ["company"],
    }),

    // UPDATE COLOR
    updateCompany: builder.mutation({
      query: ({ id, data }) => ({
        url: `/company-info/update-company-info/${id}`, // `id` in the URL
        method: "PUT",
        body: data, // Exclude `id` from the body
      }),
      invalidatesTags: ["company"],
    }),
    // DELETE COLOR
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/company-info/delete-company-info/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["company"],
    }),
  }),
});

export const {
  useAddCompanyMutation,
  useGetCompanyInfoAllQuery,
  useGetSingleCompanyQuery,
  useDeleteCompanyMutation,
  useUpdateCompanyMutation,
} = companyApi;
