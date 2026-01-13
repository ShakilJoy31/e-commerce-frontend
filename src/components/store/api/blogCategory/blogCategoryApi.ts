import { apiSlice } from "../../rootApi/apiSlice";

export const blogCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD Blog Category
    addBlogCategory: builder.mutation({
      query: (data) => ({
        url: "/blog-category/create-blog-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    // GET All Category with pagination and search
    getBlogCategories: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/blog-category/get-blog-category-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    // GET Category by ID
    getBlogCategoryById: builder.query({
      query: (id) => ({
        url: `/blog-category/get-blog-category-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    // UPDATE Blog Category by ID
    updateBlogCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/blog-category/update-blog-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    // DELETE Blog Category  by ID
    deleteBlogCategory: builder.mutation({
      query: (id) => ({
        url: `/blog-category/delete-blog-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useAddBlogCategoryMutation,
  useGetBlogCategoriesQuery,
  useGetBlogCategoryByIdQuery,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogCategoryApi;
