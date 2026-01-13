import { apiSlice } from "../../rootApi/apiSlice";

export const blogTagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE blog tag
    addBlogTag: builder.mutation({
      query: (data) => ({
        url: "/blog-tag/create-blog-tag",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogTags"],
    }),

    // GET all blog tags with pagination and search
    getBlogTags: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/blog-tag/get-blog-tag-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["blogTags"],
    }),

    // GET blog tag by ID
    getBlogTagById: builder.query({
      query: (id) => ({
        url: `/blog-tag/get-blog-tag-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["blogTags"],
    }),

    // UPDATE blog tag by ID
    updateBlogTag: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/blog-tag/update-blog-tag/${id}`,
        method: "PUT", 
        body: data,
      }),
      invalidatesTags: ["blogTags"],
    }),

    // DELETE blog tag by ID
    deleteBlogTag: builder.mutation({
      query: (id) => ({
        url: `/blog-tag/delete-blog-tag/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogTags"],
    }),
  }),
});

export const {
  useAddBlogTagMutation,
  useGetBlogTagsQuery,
  useGetBlogTagByIdQuery,
  useUpdateBlogTagMutation,
  useDeleteBlogTagMutation,
} = blogTagApi;
