import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const ramApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD 
       addRam: builder.mutation({
         query: (data) => ({
           url: "/ram/create-ram",
           method: "POST",
           body: data,
         }),
         invalidatesTags: ["ram"],
       }),
       // GET ALL SIZE
       getRams: builder.query({
         query: (data) => ({
           url: `/ram/get-ram-all?page=${data?.page || 1}&size=${
             data?.size || fallback.querySize
           }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
         }),
         providesTags: ["ram"],
       }),
       // GET SINGLE SIZE
       getSingleRam: builder.query({
         query: (id) => ({
           url: `/ram/get-ram-by-id/${id}`,
         }),
         providesTags: ["ram"],
       }),
      
       // UPDATE SIZE
       updateRam: builder.mutation({
         query: ({ id, data }) => ({
           url: `/ram/update-ram/${id}`,
           method: "PUT",
           body: data,
         }),
         invalidatesTags: ["ram"],
       }),
       // DELETE SIZE
       deleteRam: builder.mutation({
         query: (id) => ({
           url: `/ram/delete-ram/${id}`,
           method: "DELETE",
         }),
         invalidatesTags: ["ram"],
       }),
  }),
});

export const { useAddRamMutation, useDeleteRamMutation, useGetSingleRamQuery, useGetRamsQuery, useUpdateRamMutation} = ramApi;
