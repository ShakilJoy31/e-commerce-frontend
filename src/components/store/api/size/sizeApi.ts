import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const sizeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD SIZE
    addSize: builder.mutation({
      query: (data) => ({
        url: "/size/create-size",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["size"],
    }),
    
    // GET ALL SIZES
    getSizes: builder.query({
      query: (data) => ({
        url: `/size/get-size-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["size"],
    }),

    // GET SINGLE SIZE
    getSingleSize: builder.query({
      query: (id) => ({
        url: `/size/get-size-by-id/${id}`,
      }),
      providesTags: ["size"],
    }),

    // UPDATE SIZE
    updateSize: builder.mutation({
      query: ({ id, data }) => ({
        url: `/size/update-size/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["size"],
    }),

    // DELETE SIZE
    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/size/delete-size/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["size"],
    }),
  }),
});

export const {
  useAddSizeMutation,
  useDeleteSizeMutation,
  useGetSizesQuery,
  useGetSingleSizeQuery,
  useUpdateSizeMutation,
} = sizeApi;
