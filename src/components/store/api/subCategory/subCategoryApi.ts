import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const subCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD SUBCATEGORY
    addSubCategory: builder.mutation({
      query: (data) => ({
        url: "/subcategory/create-subcategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subcategory"], // Only invalidates subcategory cache
    }),
    // GET ALL SUBCATEGORY
    getSubCategory: builder.query({
      query: (data) => ({
        url: `/subcategory/get-subcategory-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["subcategory"], // Provides the subcategory tag
    }),
    // GET SINGLE SUBCATEGORY
    getSingleSubCategory: builder.query({
      query: (id) => ({
        url: `/subcategory/get-subcategory-by-id/${id}`,
      }),
      providesTags: ["subcategory"], // Provides the subcategory tag
    }),

    // UPDATE SUBCATEGORY
    updateSubCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subcategory/update-subcategory/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["subcategory"], // Only invalidates subcategory cache
    }),
    // DELETE SUBCATEGORY
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/subcategory/delete-subcategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subcategory"], // Only invalidates subcategory cache
    }),
  }),
});

export const {
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSingleSubCategoryQuery,
  useGetSubCategoryQuery,
  useUpdateSubCategoryMutation,
} = subCategoryApi;
