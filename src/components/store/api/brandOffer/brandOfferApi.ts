import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const brandOfferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD BRAND OFFER
    addBrandOffer: builder.mutation({
      query: (data) => ({
        url: "/brand-offer/create-brand-offer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["brandOffer"],
    }),

    // GET ALL BRAND OFFERS
    getBrandOffers: builder.query({
      query: (data) => ({
        url: `/brand-offer/get-brand-offer-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["brandOffer"],
    }),

    // GET SINGLE BRAND OFFER
    getSingleBrandOffer: builder.query({
      query: (id) => ({
        url: `/brand-offer/get-brand-offer-by-id/${id}`,
      }),
      providesTags: ["brandOffer"],
    }),

    // UPDATE BRAND OFFER
    updateBrandOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brand-offer/update-brand-offer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["brandOffer"],
    }),

    // DELETE BRAND OFFER
    deleteBrandOffer: builder.mutation({
      query: (id) => ({
        url: `/brand-offer/delete-brand-offer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brandOffer"],
    }),
  }),
});

export const {
  useAddBrandOfferMutation,
  useGetBrandOffersQuery,
  useGetSingleBrandOfferQuery,
  useUpdateBrandOfferMutation,
  useDeleteBrandOfferMutation,
} = brandOfferApi;
