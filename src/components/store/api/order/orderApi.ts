import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD ORDER
    addOrder: builder.mutation({
      query: (data) => ({
        url: "/order/create-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),
    adminOrder: builder.mutation({
      query: (data) => ({
        url: "/order/create-pos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),

    // GET ALL ORDER
    getOrders: builder.query({
      query: (data) => ({
        url: `/order/get-orders?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&status=${
          data?.status || "All"
        }&fromDate=${data.fromDate}&toDate=${data?.toDate}&categoryId=${
          data?.categoryId
        }&filterBy=${data?.filterBy}`,
      }),
      providesTags: ["order"],
    }),
    getPreOrdersTab: builder.query({
      query: (data) => ({
        url: `/order/get-pre-order-list?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&status=${
          data?.status || "All"
        }&fromDate=${data.fromDate}&toDate=${data?.toDate}&categoryId=${
          data?.categoryId
        }&filterBy=${data?.filterBy}`,
      }),
      providesTags: ["order"],
    }),
    getPreOrders: builder.query({
      query: (data) => ({
        url: `/order/get-pre-orders?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["order"],
    }),

    // GET ALL ORDER
    getTrustOrders: builder.query({
      query: (data) => ({
        url: `/order/get-orders-trust?page=${data?.page || 1}&size=${
          data?.size
        }`,
      }),
      providesTags: ["order"],
    }),

    getSalesReportByOrder: builder.query({
      query: (data) => ({
        url: `/order/get-sales-report-by-order?status=${data?.status}&fromDate=${data.from}&toDate=${data?.to}`,
      }),
      providesTags: ["order"],
    }),
    getSalesReportByProduct: builder.query({
      query: (data) => ({
        url: `/order/get-sales-report-by-product?status=${data?.status}&fromDate=${data.from}&toDate=${data?.to}`,
      }),
      providesTags: ["order"],
    }),
    // GET SINGLE ORDER
    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/order/get-order-by-id/${id}`,
      }),
      providesTags: ["order"],
    }),
   
    getOrderByOrderId: builder.query({
      query: (id) => ({
        url: `/order/get-order-by-order-id/${id}`,
      }),
      providesTags: ["order"],
    }),
    getUserOrderList: builder.query({
      query: (data) => ({
        url: `/user/get-user-order-list?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["order"],
    }),
    // SEARCH SINGLE ORDER
    searchSingleOrder: builder.query({
      query: (search) => ({
        url: `/order/get-order-single?search=${search}`,
      }),
      providesTags: ["order"],
    }),
    // UPDATE ORDER
    editOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/order/edit-order/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),
     editPreOrder: builder.mutation({
      query: (id) => ({
        url: `/order/change-pre-order-to-order/${id}`,
        method:"PUT"
      }),
      invalidatesTags: ["order"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/order/update-order/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),
    // UPDATE ORDER STATUS
    updateOrderStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/order/update-order-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["order", "report"],
    }),
    // DELETE ORDER
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/delete-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),

    moveBulkTrust: builder.mutation({
      query: (orderIds) => ({
        // Accept orderIds array
        url: `/order/move-bulk-trust`,
        method: "PUT",
        body: { orders: orderIds }, // Wrap in an object with 'orders' key
      }),
      invalidatesTags: ["order"],
    }),
    updateBulkOrderStatus: builder.mutation({
      query: (data) => ({
        // Accept orderIds array
        url: `/order/update-bulk-order-status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),

    getReturnOrderById: builder.query({
      query: (id) => ({
        url: `/return/get-return-order-by-id/${id}`,
      }),
      providesTags: ["order"],
    }),
    createReOrder: builder.mutation({
      query: (id) => ({
        url: `/order/create-reorder/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["order"],
    }),

    // Adding pathao order...
    createPathaoOrder: builder.mutation({
      query: (data) => ({
        url: "/pathao/create-pathao-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useAddOrderMutation,
  useAdminOrderMutation,
  useGetOrdersQuery,
  useEditOrderMutation,
  useGetSingleOrderQuery,
  useSearchSingleOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
  useGetUserOrderListQuery,
  useGetOrderByOrderIdQuery,
  useGetSalesReportByOrderQuery,
  useGetSalesReportByProductQuery,
  useGetTrustOrdersQuery,
  useMoveBulkTrustMutation,
  useUpdateBulkOrderStatusMutation,
  useGetReturnOrderByIdQuery,
  useCreateReOrderMutation,
  useCreatePathaoOrderMutation,
  useEditPreOrderMutation,
  useGetPreOrdersQuery,
  useGetPreOrdersTabQuery
} = orderApi;
