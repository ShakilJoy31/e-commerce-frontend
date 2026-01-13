import { apiSlice } from "../../rootApi/apiSlice";

export const blogTagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE blog tag
    addTag: builder.mutation({
      query: (data) => ({
        url: "/product-tag/create-product-tag",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tags"],
    }),

    // GET all blog tags with pagination and search
    getTags: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/product-tag/get-product-tag-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Tags"],
    }),

    // GET blog tag by ID
    getTagById: builder.query({
      query: (id) => ({
        url: `/product-tag/get-product-tag-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["Tags"],
    }),

    // UPDATE blog tag by ID
    updateTag: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/product-tag/update-product-tag/${id}`,
        method: "PUT", 
        body: data,
      }),
      invalidatesTags: ["Tags"],
    }),

    // DELETE blog tag by ID
    deleteTag: builder.mutation({
      query: (id) => ({
        url: `/product-tag/delete-product-tag/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags"],
    }),
  }),
});

export const {
  useAddTagMutation,
  useGetTagsQuery,
  useGetTagByIdQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = blogTagApi;
