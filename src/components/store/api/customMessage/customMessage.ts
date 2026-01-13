import { apiSlice } from "../../rootApi/apiSlice";

export const blogTagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE blog tag
    addCustomMessage: builder.mutation({
      query: (data) => ({
        url: "/custom-message-template/create-custom-message-template",
        method: "POST",
        body: {
          customMessage: data.name,
        },
      }),
      invalidatesTags: ["custom-message"],
    }),

    // GET all blog tags with pagination and search
    getCustomMessage: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/custom-message-template/get-custom-message-template-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["custom-message"],
    }),

    // GET blog tag by ID
    getCustomMessageById: builder.query({
      query: (id) => ({
        url: `/custom-message-template/get-custom-message-template-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["custom-message"],
    }),

    // UPDATE blog tag by ID
    updateCustomMessage: builder.mutation({
      query: ({ id, ...name }) => ({
        url: `/custom-message-template/update-custom-message-template/${id}`,
        method: "PUT", 
        body: {customMessage: name.name },
      }),
      invalidatesTags: ["custom-message"],
    }),

    // DELETE blog tag by ID
    deleteCustomMessage: builder.mutation({
      query: (id) => ({
        url: `/custom-message-template/delete-custom-message-template/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["custom-message"],
    }),
  }),
});

export const {
  useAddCustomMessageMutation,
  useGetCustomMessageQuery,
  useGetCustomMessageByIdQuery,
  useUpdateCustomMessageMutation,
  useDeleteCustomMessageMutation,
} = blogTagApi;
