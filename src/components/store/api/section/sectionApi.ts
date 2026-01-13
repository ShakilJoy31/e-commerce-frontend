import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const sectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE SECTION
    addSection: builder.mutation({
      query: (data) => ({
        url: "/section/create-section",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["section"],
    }),

    // GET ALL SECTIONS
    getSections: builder.query({
      query: (data) => ({
        url: `/section/get-section-all?page=${data?.page || 1}&size=${data?.size || fallback.querySize}&search=${data?.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["section"],
    }),

    // GET SINGLE SECTION
    getSingleSection: builder.query({
      query: (id) => ({
        url: `/section/get-section-by-id/${id}`,
      }),
      providesTags: ["section"],
    }),

    // UPDATE SECTION
    updateSection: builder.mutation({
      query: ({ id, data }) => ({
        url: `/section/update-section/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["section"],
    }),

    // DELETE SECTION
    deleteSection: builder.mutation({
      query: (id) => ({
        url: `/section/delete-section/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["section"],
    }),
  }),
});

export const {
  useAddSectionMutation,
  useGetSectionsQuery,
  useGetSingleSectionQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionApi;
