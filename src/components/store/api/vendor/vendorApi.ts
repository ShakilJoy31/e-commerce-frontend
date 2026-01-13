import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD 
       addVendor: builder.mutation({
         query: (data) => ({
           url: "/vendor/create-vendor",
           method: "POST",
           body: data,
         }),
         invalidatesTags: ["vendor"],
       }),
       // GET ALL VENDORS
       getVendors: builder.query({
         query: (data) => ({
           url: `/vendor/get-vendor-all?page=${data?.page || 1}&size=${
             data?.size || fallback.querySize
           }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
         }),
         providesTags: ["vendor"],
       }),
       // GET SINGLE VENDOR
       getSingleVendor: builder.query({
         query: (id) => ({
           url: `/vendor/get-vendor-by-id/${id}`,
         }),
         providesTags: ["vendor"],
       }),
      
       // UPDATE VENDOR
       updateVendor: builder.mutation({
         query: ({ id, data }) => ({
           url: `/vendor/update-vendor/${id}`,
           method: "PUT",
           body: data,
         }),
         invalidatesTags: ["vendor"],
       }),
       // DELETE VENDOR
       deleteVendor: builder.mutation({
         query: (id) => ({
           url: `/vendor/delete-vendor/${id}`,
           method: "DELETE",
         }),
         invalidatesTags: ["vendor"],
       }),
  }),
});

export const { useAddVendorMutation, useDeleteVendorMutation, useGetSingleVendorQuery, useGetVendorsQuery, useUpdateVendorMutation } = vendorApi;
