import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const featurelistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD FEATURE
    addFeatures: builder.mutation({
      query: (data) => ({
        url: "/feature/create-feature",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["feature-list"],
    }),
    // GET ALL FEATURES
    getFeatures: builder.query({
      query: (data) => ({
        url: `/feature/get-feature-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["feature-list"],
    }),
    // GET SINGLE FEATURE
    getSingleFeature: builder.query({
      query: (id) => ({
        url: `/feature/get-feature-by-id/${id}`,
      }),
      providesTags: ["feature-list"],
    }),
    // UPDATE FEATURE
    updateFeatures: builder.mutation({
      query: ({ id, data }) => ({
        url: `/feature/update-feature/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["feature-list"],
    }),
    // DELETE FEATURE
    deleteFeatures: builder.mutation({
      query: (id) => ({
        url: `/feature/delete-feature/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["feature-list"],
    }),
  }),
});

export const {
  useAddFeaturesMutation,
  useDeleteFeaturesMutation,
  useGetFeaturesQuery,
  useGetSingleFeatureQuery,
  useUpdateFeaturesMutation,
} = featurelistApi;
