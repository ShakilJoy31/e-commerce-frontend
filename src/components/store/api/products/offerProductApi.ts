import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const offerProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD PRODUCT
    addOfferProduct: builder.mutation({
      query: (data) => ({
        url: "/offer-product/create-offer-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["productsOffer"],
    }),
    // GET ALL PRODUCT
    getOfferProductsList: builder.query({
      query: (data) => ({
        url: `/offer-product/get-offer-product-all?page=${
          data?.page || 1
        }&size=${data?.size || fallback.querySize}&search=${
          data.search || ""
        }&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["productsOffer"],
    }),
    // GET SINGLE PRODUCT
    getSingleOfferProduct: builder.query({
      query: (id) => ({
        url: `/offer-product/get-offer-product-by-id/${id}`,
      }),
      providesTags: ["productsOffer"],
    }),

    // UPDATE PRODUCT
    updateOfferProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/offer-product/update-offer-product/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["productsOffer"],
    }),
    // DELETE PRODUCT
    deleteOfferProduct: builder.mutation({
      query: (id) => ({
        url: `/offer-product/delete-offer-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["productsOffer"],
    }),
  }),
});

export const {
  useAddOfferProductMutation,
  useGetOfferProductsListQuery,
  useGetSingleOfferProductQuery,
  useUpdateOfferProductMutation,
  useDeleteOfferProductMutation,
} = offerProductApi;
