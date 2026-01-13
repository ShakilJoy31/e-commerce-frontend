import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const smallBannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD SMALL BANNER
    addSmallBanner: builder.mutation({
      query: (data) => ({
        url: "/small-banner/create-small-banner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["smallBanner"],
    }),

    // GET ALL SMALL BANNERS
    getSmallBanners: builder.query({
      query: (data) => ({
        url: `/small-banner/get-small-banner-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data?.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["smallBanner"],
    }),

    // GET SINGLE SMALL BANNER
    getSingleSmallBanner: builder.query({
      query: (id) => ({
        url: `/small-banner/get-small-banner-by-id/${id}`,
      }),
      providesTags: ["smallBanner"],
    }),

    // UPDATE SMALL BANNER
    updateSmallBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/small-banner/update-small-banner/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["smallBanner"],
    }),

    // DELETE SMALL BANNER
    deleteSmallBanner: builder.mutation({
      query: (id) => ({
        url: `/small-banner/delete-small-banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["smallBanner"],
    }),
  }),
});

export const {
  useAddSmallBannerMutation,
  useGetSmallBannersQuery,
  useGetSingleSmallBannerQuery,
  useUpdateSmallBannerMutation,
  useDeleteSmallBannerMutation,
} = smallBannerApi;
