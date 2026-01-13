import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const subcategoryOfferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ADD SUBCATEGORY OFFER
    addSubcategoryOffer: builder.mutation({
      query: (data) => ({
        url: "/subcategory-offer/create-sub-category-offer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subcategoryOffer"],
    }),

    // GET ALL SUBCATEGORY OFFERS
    getSubcategoryOffers: builder.query({
      query: (data) => ({
        url: `/subcategory-offer/get-sub-category-offer-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["subcategoryOffer"],
    }),

    // GET SINGLE SUBCATEGORY OFFER
    getSingleSubcategoryOffer: builder.query({
      query: (id) => ({
        url: `/subcategory-offer/get-sub-category-offer-by-id/${id}`,
      }),
      providesTags: ["subcategoryOffer"],
    }),

    // UPDATE SUBCATEGORY OFFER
    updateSubcategoryOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subcategory-offer/update-sub-category-offer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["subcategoryOffer"],
    }),

    // DELETE SUBCATEGORY OFFER
    deleteSubcategoryOffer: builder.mutation({
      query: (id) => ({
        url: `/subcategory-offer/delete-sub-category-offer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subcategoryOffer"],
    }),
  }),
});

export const {
  useAddSubcategoryOfferMutation,
  useGetSubcategoryOffersQuery,
  useGetSingleSubcategoryOfferQuery,
  useUpdateSubcategoryOfferMutation,
  useDeleteSubcategoryOfferMutation,
} = subcategoryOfferApi;
