import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const sectionWiseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE
    addSectionWiseProductShow: builder.mutation({
      query: (data) => ({
        url: "/section-wise/create-section-wise-product-show",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["sectionWise"],
    }),

    // GET ALL
    getAllSectionWiseProductShows: builder.query({
      query: (data) => ({
        url: `/section-wise/get-section-wise-product-show-all?page=${data?.page || 1}&size=${data?.size || fallback.querySize}&search=${data?.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["sectionWise"],
    }),

    // GET HOME PAGE
    getSectionWiseProductShowForHome: builder.query({
      query: () => ({
        url: "/section-wise/get-section-wise-product-show-home-page",
      }),
      providesTags: ["sectionWise"],
    }),

    // GET BY ID
    getSectionWiseProductShowById: builder.query({
      query: (id) => ({
        url: `/section-wise/get-section-wise-product-show-by-id/${id}`,
      }),
      providesTags: ["sectionWise"],
    }),

    // UPDATE
    updateSectionWiseProductShow: builder.mutation({
      query: ({ id, data }) => ({
        url: `/section-wise/update-section-wise-product-show/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["sectionWise"],
    }),

    // DELETE
    deleteSectionWiseProductShow: builder.mutation({
      query: (id) => ({
        url: `/section-wise/delete-section-wise-product-show/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sectionWise"],
    }),
  }),
});

export const {
  useAddSectionWiseProductShowMutation,
  useGetAllSectionWiseProductShowsQuery,
  useGetSectionWiseProductShowForHomeQuery,
  useGetSectionWiseProductShowByIdQuery,
  useUpdateSectionWiseProductShowMutation,
  useDeleteSectionWiseProductShowMutation,
} = sectionWiseApi;
