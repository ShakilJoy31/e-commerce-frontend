// src/redux/features/auth/shippingAddressApi.ts
import { apiSlice } from "../rootApi/apiSlice";

export const shippingAddressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShippingInfo: builder.query({
      query: () => "/user/get-shipping-info",
      providesTags: ["ShippingAddress"],
    }),

    createShippingInfo: builder.mutation({
      query: (data) => ({
        url: "/user/create-shipping-info",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    getSingleAddress: builder.query({
      query: (id) => ({
        url: `/user/get-shipping-by-id/${id}`,
      }),
      providesTags: ["ShippingAddress"],
    }),
    updateShippingInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update-shipping-info/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ShippingAddress"],
    }),

    deleteShippingInfo: builder.mutation({
      query: (id) => ({
        url: `/user/delete-shipping-info/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShippingAddress"],
    }),


     // Pathao address services
    getPathaoCities: builder.query({
      query: () => "/pathao/get-pathao-cities",
      providesTags: ["ShippingAddress"],
    }),
    getPathaoZones: builder.query({
      query: (cityId) => `/pathao/get-pathao-zone/${cityId}`,
      providesTags: ["ShippingAddress"],
    }),
    
    getPathaoAreas: builder.query({
      query: (zoneId) => `/pathao/get-pathao-area/${zoneId}`,
      providesTags: ["ShippingAddress"],
    }),
  }),
});

export const {
  useGetShippingInfoQuery,
  useCreateShippingInfoMutation,
  useDeleteShippingInfoMutation,
  useGetPathaoCitiesQuery,
  useGetPathaoZonesQuery,
  useGetPathaoAreasQuery,
  useUpdateShippingInfoMutation
} = shippingAddressApi;
