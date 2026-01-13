import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD CATEGORY
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/product-category/create-product-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"], // Invalidates only the category cache
    }),
    // GET ALL CATEGORY
    getAllCategory: builder.query({
      // Change this key
      query: (data) => ({
        url: `/product-category/get-category-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["category"],
    }),
    getCategoryById: builder.query({
      // Change this key
      query: (id) => ({
        url: `/product-category/get-category/${id}`,
      }),
      providesTags: ["category"],
    }),
    // UPDATE CATEGORY
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-category/update-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"], // Invalidates only the category cache
    }),
    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/product-category/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"], // Invalidates only the category cache
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
  useGetCategoryByIdQuery,
} = categoryApi;
