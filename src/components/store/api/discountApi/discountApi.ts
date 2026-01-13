import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const discountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD DISCOUNT
    addDiscount: builder.mutation({
      query: (data) => ({
        url: "/discount/create-discount",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["discount"],
    }),
    // GET ALL DISCOUNTS
    getDiscountInfoAll: builder.query({
      query: (data) => ({
        url: `/discount/get-discount-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["discount"],
    }),
    // GET SINGLE DISCOUNT
    getSingleDiscount: builder.query({
      query: (id) => ({
        url: `/discount/get-discount-by-id/${id}`,
      }),
      providesTags: ["discount"],
    }),
    // UPDATE DISCOUNT
    updateDiscount: builder.mutation({
      query: ({ id, data }) => ({
        url: `/discount/update-discount/${id}`,
        method: "PUT",
        body: data, // now 'data' is the actual object
      }),
      invalidatesTags: ["discount"],
    }),
    // DELETE DISCOUNT
    deleteDiscount: builder.mutation({
      query: (id) => ({
        url: `/discount/delete-discount/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["discount"],
    }),
    // VERIFY COUPON
    verifyCoupon: builder.query({
      query: ({ code, totalAmount }) => ({
        url: `/discount/verify-coupon?code=${code || ""}&totalAmount=${totalAmount}`,
      }),
      providesTags: ["discount"],
    }),
  }),
});

export const {
  useAddDiscountMutation,
  useGetDiscountInfoAllQuery,
  useGetSingleDiscountQuery,
  useDeleteDiscountMutation,
  useUpdateDiscountMutation,
  useVerifyCouponQuery,
  useLazyVerifyCouponQuery 
} = discountApi;
