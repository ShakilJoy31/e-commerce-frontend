import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CUSTOMERS
    getCustomers: builder.query({
      query: (data) => ({
        url: `/user/get-customer-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${
          data?.sort || "desc"
        }&orderCountFilterType=${data?.orderCount}&orderAmountFilterType=${
          data?.orderAmount
        }&sortBy=${data?.sortBy}`,
      }),
      providesTags: ["customer"],
    }),

    getAdmin: builder.query({
      query: (data) => ({
        url: `/user/get-admin-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["customer"],
    }),
    getHomePageData: builder.query({
      query: () => ({
        url: `/user/get-home-page-data`,
      }),
      providesTags: ["home"],
    }),
    getNavbarData: builder.query({
      query: () => ({
        url: `/user/get-navbar-footer-data`,
      }),
      providesTags: ["nav"],
    }),
    getUserNotification: builder.query({
      query: () => ({
        url: `/user/get-notification`,
      }),
      providesTags: ["customer"],
    }),

    // GET SINGLE CUSTOMER
    getSingleCustomer: builder.query({
      query: (id) => ({
        url: `/user/get-customer-by-id/${id}`,
      }),
      providesTags: ["customer"],
    }),

    // CREATE A NEW USER
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/user/create-user",
        method: "POST",
        body: userData, // Send user data in the body
      }),
      invalidatesTags: ["customer"],
    }),

    getUsers: builder.query({
      query: (data) => ({
        url: `/user/get-user-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["customer"],
    }),

    // GET SINGLE CUSTOMER
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/user/get-user-by-id/${id}`,
      }),
      providesTags: ["customer"],
    }),

    getDashboardActivityLog: builder.query({
      query: (params) => {
        const {
          page = 1,
          size = fallback.querySize,
          search = "",
          sort = "desc",
        } = params || {};
        return {
          url: `/dashboard/user-activity-log`,
          params: {
            page,
            size,
            search,
            sortOrder: sort,
          },
        };
      },
      providesTags: ["customer"],
    }),

    // GET USER ACTIVITY LOG
    getUserActivityLog: builder.query({
      query: (id) => ({
        url: `/user/get-user-activity-log/${id}`,
        method: "GET",
      }),
      providesTags: ["customer"],
    }),

    // UPDATE USER DETAILS
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["customer"],
    }),

    // DELETE A USER
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customer"],
    }),
    deleteCashe: builder.mutation({
      query: () => ({
        url: `/dashboard/delete-redis-cache`,
        method: "DELETE",
      }),
      invalidatesTags: ["customer", "products"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetSingleCustomerQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useGetUsersQuery,
  useGetAdminQuery,
  useGetUserActivityLogQuery,
  useGetDashboardActivityLogQuery,
  useGetUserNotificationQuery,
  useDeleteCasheMutation,
  useGetHomePageDataQuery,
  useGetNavbarDataQuery
} = userApi;
