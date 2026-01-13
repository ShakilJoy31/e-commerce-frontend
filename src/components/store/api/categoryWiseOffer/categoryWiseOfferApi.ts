import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const categoryOfferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD CATEGORY OFFER
    addCategoryOffer: builder.mutation({
      query: (data) => ({
        url: "/category-offer/create-category-offer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categoryOffer"],
    }),

    // GET ALL CATEGORY OFFERS
    getCategoryOffers: builder.query({
      query: (data) => ({
        url: `/category-offer/get-category-offer-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["categoryOffer"],
    }),

    // GET SINGLE CATEGORY OFFER
    getSingleCategoryOffer: builder.query({
      query: (id) => ({
        url: `/category-offer/get-category-offer-by-id/${id}`,
      }),
      providesTags: ["categoryOffer"],
    }),

    // UPDATE CATEGORY OFFER
    updateCategoryOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category-offer/update-category-offer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categoryOffer"],
    }),

    // DELETE CATEGORY OFFER
    deleteCategoryOffer: builder.mutation({
      query: (id) => ({
        url: `/category-offer/delete-category-offer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categoryOffer"],
    }),
  }),
});

export const {
  useAddCategoryOfferMutation,
  useGetCategoryOffersQuery,
  useGetSingleCategoryOfferQuery,
  useUpdateCategoryOfferMutation,
  useDeleteCategoryOfferMutation,
} = categoryOfferApi;
