import { apiSlice } from "../../rootApi/apiSlice";

export const regularWarrantyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE regular warranty
    addRegularWarranty: builder.mutation({
      query: (data) => ({
        url: "/regular-warranty/create-regular-warranty",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["regularWarranties"],
    }),

    // GET all regular warranties with pagination and search
    getRegularWarranties: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/regular-warranty/get-regular-warranty-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["regularWarranties"],
    }),

    // GET regular warranty by ID
    getRegularWarrantyById: builder.query({
      query: (id) => ({
        url: `/regular-warranty/get-regular-warranty-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["regularWarranties"],
    }),

    // UPDATE regular warranty by ID
    updateRegularWarranty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/regular-warranty/update-regular-warranty/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["regularWarranties"],
    }),

    // DELETE regular warranty by ID
    deleteRegularWarranty: builder.mutation({
      query: (id) => ({
        url: `/regular-warranty/delete-regular-warranty/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["regularWarranties"],
    }),
  }),
});

export const {
  useAddRegularWarrantyMutation,
  useGetRegularWarrantiesQuery,
  useGetRegularWarrantyByIdQuery,
  useUpdateRegularWarrantyMutation,
  useDeleteRegularWarrantyMutation,
} = regularWarrantyApi;
