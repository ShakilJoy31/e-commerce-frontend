import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const colorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD COLOR
       addColor: builder.mutation({
         query: (data) => ({
           url: "/color/create-color",
           method: "POST",
           body: data,
         }),
         invalidatesTags: ["color"],
       }),
       // GET ALL COLOR
       getColors: builder.query({
         query: (data) => ({
           url: `/color/get-color-all?page=${data?.page || 1}&size=${
             data?.size || fallback.querySize
           }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
         }),
         providesTags: ["color"],
       }),
       // GET SINGLE COLOR
       getSingleColor: builder.query({
         query: (id) => ({
           url: `/color/get-color-by-id/${id}`,
         }),
         providesTags: ["color"],
       }),
      
       // UPDATE COLOR
       updateColor: builder.mutation({
         query: ({ id, data }) => ({
           url: `/color/update-color/${id}`,
           method: "PUT",
           body: data,
         }),
         invalidatesTags: ["color"],
       }),
       // DELETE COLOR
       deleteColor: builder.mutation({
         query: (id) => ({
           url: `/color/delete-color/${id}`,
           method: "DELETE",
         }),
         invalidatesTags: ["color"],
       }),
  }),
});

export const { useAddColorMutation, useDeleteColorMutation, useGetColorsQuery, useGetSingleColorQuery, useUpdateColorMutation } = colorApi;
