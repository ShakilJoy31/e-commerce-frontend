import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const connectivityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD CONNECTIVITY
    addConnectivity: builder.mutation({
      query: (data) => ({
        url: "/connectivity/create-connectivity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["connectivity"],
    }),

    // GET ALL CONNECTIVITIES
    getConnectivities: builder.query({
      query: (data) => ({
        url: `/connectivity/get-connectivity-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["connectivity"],
    }),

    // GET SINGLE CONNECTIVITY
    getSingleConnectivity: builder.query({
      query: (id) => ({
        url: `/connectivity/get-connectivity-by-id/${id}`,
      }),
      providesTags: ["connectivity"],
    }),

    // UPDATE CONNECTIVITY
    updateConnectivity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/connectivity/update-connectivity/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["connectivity"],
    }),

    // DELETE CONNECTIVITY
    deleteConnectivity: builder.mutation({
      query: (id) => ({
        url: `/connectivity/delete-connectivity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["connectivity"],
    }),
  }),
});

export const {
  useAddConnectivityMutation,
  useDeleteConnectivityMutation,
  useGetConnectivitiesQuery,
  useGetSingleConnectivityQuery,
  useUpdateConnectivityMutation,
} = connectivityApi;
