import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const warrantyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD WARRANTY
    addWarranty: builder.mutation({
      query: (data) => ({
        url: "/warranty/create-warranty",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["warranty"],
    }),

    // GET ALL WARRANTIES
    getWarranties: builder.query({
      query: (data) => ({
        url: `/warranty/get-warranty-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["warranty"],
    }),

    // GET SINGLE WARRANTY
    getSingleWarranty: builder.query({
      query: (id) => ({
        url: `/warranty/get-warranty-by-id/${id}`,
      }),
      providesTags: ["warranty"],
    }),

    // UPDATE WARRANTY
    updateWarranty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/warranty/update-warranty/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["warranty"],
    }),

    // DELETE WARRANTY
    deleteWarranty: builder.mutation({
      query: (id) => ({
        url: `/warranty/delete-warranty/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["warranty"],
    }),
  }),
});

export const {
  useAddWarrantyMutation,
  useDeleteWarrantyMutation,
  useGetSingleWarrantyQuery,
  useGetWarrantiesQuery,
  useUpdateWarrantyMutation,
} = warrantyApi;
