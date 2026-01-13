import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const popupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE POPUP
    addPopup: builder.mutation({
      query: (data) => ({
        url: "/popup/create-popup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pupupList"],
    }),

    // GET ALL POPUPS
    getPopups: builder.query({
      query: (data) => ({
        url: `/popup/get-popup-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data?.search || ""}&status=${data?.status || ""}`,
      }),
      providesTags: ["pupupList"],
    }),

    // GET SINGLE POPUP BY ID
    getSinglePopup: builder.query({
      query: (id) => ({
        url: `/popup/get-popup-by-id/${id}`,
      }),
      providesTags: ["pupupList"],
    }),

    // UPDATE POPUP
    updatePopup: builder.mutation({
      query: ({ id, data }) => ({
        url: `/popup/update-popup/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["pupupList"],
    }),

    // DELETE POPUP
    deletePopup: builder.mutation({
      query: (id) => ({
        url: `/popup/delete-popup/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pupupList"],
    }),
  }),
});

export const {
  useAddPopupMutation,
  useGetPopupsQuery,
  useGetSinglePopupQuery,
  useUpdatePopupMutation,
  useDeletePopupMutation,
} = popupApi;
