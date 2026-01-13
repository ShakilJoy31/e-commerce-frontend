
import { apiSlice } from "../../rootApi/apiSlice";

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET Dashboard Statistics
    getDashboardStatistics: builder.query({
      query: () => ({
        url: "/dashboard/statics",
      }),
      providesTags: ["report"],
    }),

    // GET Sell Information
    getSellInformation: builder.query({
      query: (data) => ({
        url: `/dashboard/sell-information?days=${data?.days}`,
      }),
      providesTags: ["report"],
    }),

    // GET Order Cycle Time
    getOrderCycleTime: builder.query({
      query: (data) => ({
        url: `/dashboard/order-cycle-time?days=${data.days}`,
      }),
      providesTags: ["report"],
    }),

    // GET Order Over Time
    getOrderOverTime: builder.query({
      query: (data) => ({
        url: `/dashboard/order-over-time?day1=${data?.day1}&day2=${data?.day2}`,
      }),
      providesTags: ["report"],
    }),

    // GET Sales Report
    getSalesReport: builder.query({
      query: (data) => ({
        url: `/dashboard/sales-report?days=${data?.days}`,
      }),
      providesTags: ["report"],
    }),

    // GET Recent Orders
    getRecentOrders: builder.query({
      query: (data) => ({
        url: `/dashboard/recent-order?days=${data?.days}&status=${data?.status}`,
      }),
      providesTags: ["report"],
    }),

    // GET Order Source Report
    getOrderSourceReport: builder.query({
      query: (data) => ({
        url: `/dashboard/order-source-report?days=${data?.days}`,
      }),
      providesTags: ["report"],
    }),

    // GET Order Value by Source
    getOrderValueBySource: builder.query({
      query: (data) => ({
        url: `/dashboard/order-value-by-source?days=${data.days}`,
      }),
      providesTags: ["report"],
    }),

    // GET Top Sell Products
    getTopSellProducts: builder.query({
      query: (data) => ({
        url: `/dashboard/top-sell-products?statusFilter=${data?.statusFilter}&top=${data?.top}`,
      }),
      providesTags: ["report"],
    }),

    // GET Cancel Order Reason
    getCancelOrderReason: builder.query({
      query: (data) => ({
        url: `/dashboard/cancel-order-reason?days=${data.days}`,
      }),
      providesTags: ["report"],
    }),

    // GET Return Order Reason
    getReturnOrderReason: builder.query({
      query: (data) => ({
        url: `/dashboard/return-order-reason?days=${data.days}`,
      }),
      providesTags: ["report"],
    }),

    // GET Order Count by Location
    getOrderCountByLocation: builder.query({
      query: (data) => ({
        url: `/dashboard/order-count-by-location?days=${data.days}`,
      }),
      providesTags: ["report"],
    }),

    // GET Order Value by Location
    getOrderValueByLocation: builder.query({
      query: (data) => ({
        url: `/dashboard/order-value-by-location?days=${data?.days}`,
      }),
      providesTags: ["report"],
    }),
  }),
});

export const {
  useGetDashboardStatisticsQuery,
  useGetSellInformationQuery,
  useGetOrderCycleTimeQuery,
  useGetOrderOverTimeQuery,
  useGetSalesReportQuery,
  useGetRecentOrdersQuery,
  useGetOrderSourceReportQuery,
  useGetOrderValueBySourceQuery,
  useGetTopSellProductsQuery,
  useGetCancelOrderReasonQuery,
  useGetReturnOrderReasonQuery,
  useGetOrderCountByLocationQuery,
  useGetOrderValueByLocationQuery,
} = reportApi;
