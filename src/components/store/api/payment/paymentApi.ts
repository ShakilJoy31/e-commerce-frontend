
import { apiSlice } from "../../rootApi/apiSlice";

const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // PAYMENT INSTANCE (POST /payment/instance/:id)
    paymentInstance: builder.mutation({
      query: (data) => ({
        url: `/payment/instance/${data.id}`,  
        method: "POST",
        body: data,  
      }),
      invalidatesTags: ["payment"], 
    }),

    // PAYMENT WEBHOOK (GET /payment/webhook/:id)
    paymentWebhook: builder.query({
      query: (id) => ({
        url: `/payment/webhook/${id}`,  
      }),
      providesTags: ["payment"],  
    }),
  }),
});

export const {
  usePaymentInstanceMutation,  
  usePaymentWebhookQuery,  
} = paymentApi;

export default paymentApi;
