import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const brandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD BRAND
       addBrand: builder.mutation({
         query: (data) => ({
           url: "/brand/create-brand",
           method: "POST",
           body: data,
         }),
         invalidatesTags: ["brand"],
       }),
       // GET ALL BRAND
       getBrands: builder.query({
         query: (data) => ({
           url: `/brand/get-brand-all?page=${data?.page || 1}&size=${
             data?.size || fallback.querySize
           }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
         }),
         providesTags: ["brand"],
       }),
       // GET SINGLE BRAND
       getSingleBrand: builder.query({
         query: (id) => ({
           url: `/brand/get-brand-by-id/${id}`,
         }),
         providesTags: ["brand"],
       }),
      
       // UPDATE BRAND
       updateBrand: builder.mutation({
         query: ({ id, data }) => ({
           url: `/brand/update-brand/${id}`,
           method: "PUT",
           body: data,
         }),
         invalidatesTags: ["brand"],
       }),
       // DELETE BRAND
       deleteBrand: builder.mutation({
         query: (id) => ({
           url: `/brand/delete-brand/${id}`,
           method: "DELETE",
         }),
         invalidatesTags: ["brand"],
       }),
  }),
});

export const { useAddBrandMutation, useDeleteBrandMutation, useGetBrandsQuery, useGetSingleBrandQuery, useUpdateBrandMutation } = brandApi;
