import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const chipsetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD CHIPSET
    addChipset: builder.mutation({
      query: (data) => ({
        url: "/chipset/create-chipset",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chipset"],
    }),

    // GET ALL CHIPSETS
    getChipsets: builder.query({
      query: (data) => ({
        url: `/chipset/get-chipset-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["chipset"],
    }),

    // GET SINGLE CHIPSET
    getSingleChipset: builder.query({
      query: (id) => ({
        url: `/chipset/get-chipset-by-id/${id}`,
      }),
      providesTags: ["chipset"],
    }),

    // UPDATE CHIPSET
    updateChipset: builder.mutation({
      query: ({ id, data }) => ({
        url: `/chipset/update-chipset/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["chipset"],
    }),

    // DELETE CHIPSET
    deleteChipset: builder.mutation({
      query: (id) => ({
        url: `/chipset/delete-chipset/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chipset"],
    }),
  }),
});

export const {
  useAddChipsetMutation,
  useGetChipsetsQuery,
  useGetSingleChipsetQuery,
  useUpdateChipsetMutation,
  useDeleteChipsetMutation,
} = chipsetApi;
