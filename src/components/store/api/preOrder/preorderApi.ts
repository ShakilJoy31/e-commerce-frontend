import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const preOrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new pre-order
    createPreOrder: builder.mutation({
      query: (data) => ({
        url: "/pre-order/create-pre-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PreOrder"],
    }),

    // Get all pre-orders with pagination and filtering
    getAllPreOrders: builder.query({
      query: (data) => ({
        url: `/pre-order/get-pre-order-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["PreOrder"],
    }),

    // Get single pre-order by ID
    getPreOrderById: builder.query({
      query: (id) => ({
        url: `/pre-order/get-pre-order-by-id/${id}`,
      }),
      providesTags: (id) => [{ type: "PreOrder", id }],
    }),

    // Update pre-order by ID
    updatePreOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/pre-order/update-pre-order/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ({ id }) => [{ type: "PreOrder", id }],
    }),

    // Delete pre-order by ID
    deletePreOrder: builder.mutation({
      query: (id) => ({
        url: `/pre-order/delete-pre-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PreOrder"],
    }),
  }),
});

export const {
  useCreatePreOrderMutation,
  useGetAllPreOrdersQuery,
  useGetPreOrderByIdQuery,
  useUpdatePreOrderMutation,
  useDeletePreOrderMutation,
} = preOrderApi;
