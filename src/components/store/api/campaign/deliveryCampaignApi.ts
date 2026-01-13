import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const deliveryCampaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD DELIVERY CAMPAIGN
    addDeliveryCampaign: builder.mutation({
      query: (data) => ({
        url: "/delivery-campaign/create-delivery-campaign",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["deliveryCampaign"],
    }),

    // GET ALL DELIVERY CAMPAIGNS
    getDeliveryCampaigns: builder.query({
      query: (data) => ({
        url: `/delivery-campaign/get-delivery-campaign-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["deliveryCampaign"],
    }),

    // GET SINGLE DELIVERY CAMPAIGN
    getSingleDeliveryCampaign: builder.query({
      query: (id) => ({
        url: `/delivery-campaign/get-delivery-campaign-by-id/${id}`,
      }),
      providesTags: ["deliveryCampaign"],
    }),

    // UPDATE DELIVERY CAMPAIGN
    updateDeliveryCampaign: builder.mutation({
      query: ({ id, data }) => ({
        url: `/delivery-campaign/update-delivery-campaign/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["deliveryCampaign"],
    }),

    // DELETE DELIVERY CAMPAIGN
    deleteDeliveryCampaign: builder.mutation({
      query: (id) => ({
        url: `/delivery-campaign/delete-delivery-campaign/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deliveryCampaign"],
    }),
  }),
});

export const {
  useAddDeliveryCampaignMutation,
  useGetDeliveryCampaignsQuery,
  useGetSingleDeliveryCampaignQuery,
  useUpdateDeliveryCampaignMutation,
  useDeleteDeliveryCampaignMutation,
} = deliveryCampaignApi;
