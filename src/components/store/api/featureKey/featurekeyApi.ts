import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const featureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD FEATURE
    addFeature: builder.mutation({
      query: (data) => ({
        url: "/feature-key/create-feature-key",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["feature"],
    }),
    // GET ALL FEATURE
    getFeature: builder.query({
      query: (data) => ({
        url: `/feature-key/get-feature-key-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["feature"],
    }),
    // GET SINGLE FEATURE
    getSingleFeature: builder.query({
      query: (id) => ({
        url: `/feature-key/get-feature-key-by-id/${id}`,
      }),
      providesTags: ["feature"],
    }),

    // UPDATE FEATURE
    updateFeature: builder.mutation({
      query: ({ id, data }) => ({
        url: `/feature-key/update-feature-key/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["feature"],
    }),
    // DELETE FEATURE
    deleteFeature: builder.mutation({
      query: (id) => ({
        url: `/feature-key/delete-feature-key/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["feature"],
    }),
  }),
});

export const {
  useAddFeatureMutation,
  useDeleteFeatureMutation,
  useGetFeatureQuery,
  useGetSingleFeatureQuery,
  useUpdateFeatureMutation,
} = featureApi;
