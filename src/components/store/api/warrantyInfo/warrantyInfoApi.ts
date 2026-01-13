import { apiSlice } from "../../rootApi/apiSlice";

export const warrantyInfoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE warranty info
    addWarrantyInfo: builder.mutation({
      query: (data) => ({
        url: "/warranty-info/create-warranty-info",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["warrantyInfos"],
    }),

    // GET all warranty infos with pagination and search
    getWarrantyInfos: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/warranty-info/get-warranty-info-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["warrantyInfos"],
    }),

    // GET warranty info by ID
    getWarrantyInfoById: builder.query({
      query: (id) => ({
        url: `/warranty-info/get-warranty-info-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["warrantyInfos"],
    }),

    // UPDATE warranty info by ID
    updateWarrantyInfo: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/warranty-info/update-warranty-info/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["warrantyInfos"],
    }),

    // DELETE warranty info by ID
    deleteWarrantyInfo: builder.mutation({
      query: (id) => ({
        url: `/warranty-info/delete-warranty-info/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["warrantyInfos"],
    }),
  }),
});

export const {
  useAddWarrantyInfoMutation,
  useGetWarrantyInfosQuery,
  useGetWarrantyInfoByIdQuery,
  useUpdateWarrantyInfoMutation,
  useDeleteWarrantyInfoMutation,
} = warrantyInfoApi;
