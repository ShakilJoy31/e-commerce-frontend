import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const imageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD IMAGE
    addSearch: builder.mutation({
      query: (data) => ({
        url: "/search/create-search", // Adjust endpoint based on backend
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["search"],
    }),

    // GET ALL IMAGES
    getSearch: builder.query({
      query: (data) => ({
        url: `/search/get-search-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["search"],
    }),

    // GET SINGLE IMAGE
    getSingleSearch: builder.query({
      query: (id) => ({
        url: `/search/get-search-by-id/${id}`,
      }),
      providesTags: ["search"],
    }),

    // UPDATE IMAGE
    updateSearch: builder.mutation({
      query: ({ id, data }) => ({
        url: `/search/update-search/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["search"],
    }),

    // DELETE IMAGE
    deleteSearch: builder.mutation({
      query: (id) => ({
        url: `/search/delete-search/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["search"],
    }),
  }),
});

export const {
 useAddSearchMutation,
 useDeleteSearchMutation,
 useGetSearchQuery,
 useGetSingleSearchQuery,
 useUpdateSearchMutation
} = imageApi;
