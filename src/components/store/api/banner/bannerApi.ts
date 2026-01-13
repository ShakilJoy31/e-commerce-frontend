import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD BANNER
    addBanner: builder.mutation({
      query: (data) => ({
        url: "/banner/create-banner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),
    // GET ALL BANNERS
    getBanners: builder.query({
      query: (data) => ({
        url: `/banner/get-banner-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["banner"],
    }),
    // GET SINGLE BANNER
    getSingleBanner: builder.query({
      query: (id) => ({
        url: `/banner/get-banner-by-id/${id}`,
      }),
      providesTags: ["banner"],
    }),
    // UPDATE BANNER
    updateBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/banner/update-banner/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),
    // DELETE BANNER
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/delete-banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banner"],
    }),
  }),
});

export const {
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
  useGetSingleBannerQuery,
  useUpdateBannerMutation,
} = bannerApi;
