import { apiSlice } from "../../rootApi/apiSlice";

export const giftApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD Gift
    addGift: builder.mutation({
      query: (data) => ({
        url: "/gift/create-gift",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Gift"],
    }),

    // GET ALL Gifts
    getGifts: builder.query({
      query: (data) => ({
        url: `/gift/get-gift-all?page=${data?.page || 1}&size=${
          data?.size || 10
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["Gift"],
    }),

    // GET SINGLE Gift
    getSingleGift: builder.query({
      query: (id) => ({
        url: `/gift/get-gift-by-id/${id}`,
      }),
      providesTags: ["Gift"],
    }),

    // UPDATE Gift
    updateGift: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gift/update-gift/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Gift"],
    }),

    // DELETE Gift
    deleteGift: builder.mutation({
      query: (id) => ({
        url: `/gift/delete-gift/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Gift"],
    }),
  }),
});

export const {
  useAddGiftMutation,
  useDeleteGiftMutation,
  useGetSingleGiftQuery,
  useGetGiftsQuery,
  useUpdateGiftMutation,
} = giftApi;
