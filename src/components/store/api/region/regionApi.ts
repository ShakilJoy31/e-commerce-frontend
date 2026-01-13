import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const regionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD REGION
    addRegion: builder.mutation({
      query: (data) => ({
        url: "/region/create-region",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["region"],
    }),

    // GET ALL REGIONS
    getRegions: builder.query({
      query: (data) => ({
        url: `/region/get-region-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["region"],
    }),

    // GET SINGLE REGION
    getSingleRegion: builder.query({
      query: (id) => ({
        url: `/region/get-region-by-id/${id}`,
      }),
      providesTags: ["region"],
    }),

    // UPDATE REGION
    updateRegion: builder.mutation({
      query: ({ id, data }) => ({
        url: `/region/update-region/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["region"],
    }),

    // DELETE REGION
    deleteRegion: builder.mutation({
      query: (id) => ({
        url: `/region/delete-region/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["region"],
    }),
  }),
});

export const {
  useAddRegionMutation,
  useGetRegionsQuery,
  useGetSingleRegionQuery,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
} = regionApi;
