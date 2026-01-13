import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const returnProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE RETURN ORDER
    createReturnOrder: builder.mutation({
      query: (data) => ({
        url: "/return/create-return-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["returnProduct"],
    }),

    // GET ALL RETURN ORDERS
    getReturnOrders: builder.query({
      query: (data) => ({
        url: `/return/get-return-orders?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["returnProduct"],
    }),

    // GET RETURN ORDERS BY USER
    getReturnOrdersByUser: builder.query({
      query: () => ({
        url: "/return/get-return-orders-by-user",
      }),
      providesTags: ["returnProduct"],
    }),

    // GET SINGLE RETURN ORDER BY ID
    getSingleReturnOrder: builder.query({
      query: (id) => ({
        url: `/return/get-return-order-by-id/${id}`,
      }),
      providesTags: ["returnProduct"],
    }),

    // UPDATE RETURN ORDER STATUS
    updateReturnOrderStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/return/update-return-order-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["returnProduct"],
    }),

    // DELETE RETURN ORDER
    deleteReturnOrder: builder.mutation({
      query: (id) => ({
        url: `/return/delete-return-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["returnProduct"],
    }),
  }),
});

export const {
  useCreateReturnOrderMutation,
  useGetReturnOrdersQuery,
  useGetReturnOrdersByUserQuery,
  useGetSingleReturnOrderQuery,
  useUpdateReturnOrderStatusMutation,
  useDeleteReturnOrderMutation,
} = returnProductApi;
