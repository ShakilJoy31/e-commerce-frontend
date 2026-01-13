import { apiSlice } from "../../rootApi/apiSlice";

export const shippingInfoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create shipping info
    createShippingInfo: builder.mutation({
      query: (data) => ({
        url: "/user/create-shipping-info",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shippingInfo"],
    }),

    // Update shipping info by ID
    // updateShippingInfo: builder.mutation({
    //   query: ({ id, ...data }) => ({
    //     url: `/user/update-shipping-info/${id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["shippingInfo"],
    // }),

    // Delete shipping info by ID
    deleteShippingInfo: builder.mutation({
      query: (id) => ({
        url: `/user/delete-shipping-info/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["shippingInfo"],
    }),

    // Get all shipping info
    getShippingInfo: builder.query({
      query: () => "/user/get-shipping-info",
      providesTags: ["shippingInfo"],
    }),
  }),
});


export const {
  useCreateShippingInfoMutation,
  // useUpdateShippingInfoMutation,
  useDeleteShippingInfoMutation,
  useGetShippingInfoQuery,
} = shippingInfoApi;
