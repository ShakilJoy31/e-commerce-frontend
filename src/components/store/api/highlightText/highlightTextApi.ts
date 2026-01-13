import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const highlightTextApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD Highlight Text
    addHighlightText: builder.mutation({
      query: (data) => ({
        url: "/highlight-text/create-highlight-text",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["highlightText"],
    }),
    // GET ALL Highlight Texts
    getHighlightTexts: builder.query({
      query: (data) => ({
        url: `/highlight-text/get-highlight-text-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["highlightText"],
    }),
    // GET SINGLE Highlight Text
    getSingleHighlightText: builder.query({
      query: (id) => ({
        url: `/highlight-text/get-highlight-text-by-id/${id}`,
      }),
      providesTags: ["highlightText"],
    }),
    
    // UPDATE Highlight Text
    updateHighlightText: builder.mutation({
      query: ({ id, data }) => ({
        url: `/highlight-text/update-highlight-text/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["highlightText"],
    }),
    // DELETE Highlight Text
    deleteHighlightText: builder.mutation({
      query: (id) => ({
        url: `/highlight-text/delete-highlight-text/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["highlightText"],
    }),
  }),
});

export const { 
  useAddHighlightTextMutation, 
  useDeleteHighlightTextMutation, 
  useGetSingleHighlightTextQuery, 
  useGetHighlightTextsQuery, 
  useUpdateHighlightTextMutation 
} = highlightTextApi;
