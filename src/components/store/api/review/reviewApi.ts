import { apiSlice } from "../../rootApi/apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD REVIEW
    addReview: builder.mutation({
      query: (data) => ({
        url: "/review/create-review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["review", "products"],
    }),

    // GET REVIEW BY USER
    getReviewByUser: builder.query({
      query: () => ({
        url: "/review/get-review-by-user",
      }),
      providesTags: ["review"],
    }),

    // GET REVIEW BY PRODUCT
    getReviewByProduct: builder.query({
      query: (id) => ({
        url: `/review/get-review-by-product/${id}`,
      }),
      providesTags: ["review"],
    }),

    // UPDATE REVIEW
    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/review/update-review/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["review", "products"],
    }),

    // DELETE REVIEW
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/review/delete-review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["review", "products"],
    }),

    // REPLY TO REVIEW
    replyToReview: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/review/review-replay/${id}`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: ["review"],
    }),

    // UPDATE REVIEW REPLY
    updateReviewReply: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/review/update-review-replay/${id}`,
        method: "PUT",
        body: { comment },
      }),
      invalidatesTags: ["review"],
    }),

    // DELETE REVIEW REPLY
    deleteReviewReply: builder.mutation({
      query: (id) => ({
        url: `/review/delete-review-replay/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["review"],
    }),
  }),
});

export const {
  useAddReviewMutation,
  useGetReviewByUserQuery,
  useGetReviewByProductQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useReplyToReviewMutation,
  useUpdateReviewReplyMutation,
  useDeleteReviewReplyMutation,
} = reviewApi;