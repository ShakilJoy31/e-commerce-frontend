import { apiSlice } from "../../rootApi/apiSlice";

export const orderMessageTemplateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET all message templates
    getOrderMessageTemplate: builder.query({
      query: () => "/dashboard/order-message-template",
      providesTags: ["orderMessageTemplate"],
    }),

    // UPDATE any single message field (partial update)
    updateOrderMessageField: builder.mutation({
      query: (data) => ({
        url: "/dashboard/update-message-template",
        method: "PUT",
        body: data, // e.g., { otpMessage: "New OTP message" }
      }),
      invalidatesTags: ["orderMessageTemplate"],
    }),
  }),
});

export const {
  useGetOrderMessageTemplateQuery,
  useUpdateOrderMessageFieldMutation,
} = orderMessageTemplateApi;
