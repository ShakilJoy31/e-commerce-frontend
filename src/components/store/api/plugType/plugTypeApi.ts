import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const plugTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD PLUG-TYPE
    addPlugType: builder.mutation({
      query: (data) => ({
        url: "/plug-type/create-plug-type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["plug-type"],
    }),

    // GET ALL PLUG-TYPES
    getPlugTypes: builder.query({
      query: (data) => ({
        url: `/plug-type/get-plug-type-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["plug-type"],
    }),

    // GET SINGLE PLUG-TYPE
    getSinglePlugType: builder.query({
      query: (id) => ({
        url: `/plug-type/get-plug-type-by-id/${id}`,
      }),
      providesTags: ["plug-type"],
    }),

    // UPDATE PLUG-TYPE
    updatePlugType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/plug-type/update-plug-type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["plug-type"],
    }),

    // DELETE PLUG-TYPE
    deletePlugType: builder.mutation({
      query: (id) => ({
        url: `/plug-type/delete-plug-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["plug-type"],
    }),
  }),
});

export const {
  useAddPlugTypeMutation,
  useDeletePlugTypeMutation,
  useGetPlugTypesQuery,
  useGetSinglePlugTypeQuery,
  useUpdatePlugTypeMutation,
} = plugTypeApi;
