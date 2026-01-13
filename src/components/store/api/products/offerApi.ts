import { apiSlice } from "../../rootApi/apiSlice";

const offerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE OFFER
    createOffer: builder.mutation({
      query: (data) => ({
        url: "/offer/create-offer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["offers"],
    }),

    // GET ALL OFFERS
    getAllOffers: builder.query({
      query: () => ({
        url: "/offer/get-offer-all",
      }),
      providesTags: ["offers"],
    }),

    // GET OFFER BY ID
    getOfferById: builder.query({
      query: (id) => ({
        url: `/offer/get-offer-by-id/${id}`,
      }),
      providesTags: ["offers"],
    }),

    // UPDATE OFFER
    updateOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/offer/update-offer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["offers"],
    }),

    // DELETE OFFER
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `/offer/delete-offer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["offers"],
    }),
  }),
});

export const {
  useCreateOfferMutation,
  useGetAllOffersQuery,
  useGetOfferByIdQuery,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = offerApi;
