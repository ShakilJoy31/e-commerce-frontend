import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const conditionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD CONDITION
    addCondition: builder.mutation({
      query: (data) => ({
        url: "/condition/create-condition",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["condition"],
    }),
    // GET ALL CONDITIONS
    getConditions: builder.query({
      query: (data) => ({
        url: `/condition/get-condition-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["condition"],
    }),
    // GET SINGLE CONDITION
    getSingleCondition: builder.query({
      query: (id) => ({
        url: `/condition/get-condition-by-id/${id}`,
      }),
      providesTags: ["condition"],
    }),
    // UPDATE CONDITION
    updateCondition: builder.mutation({
      query: ({ id, data }) => ({
        url: `/condition/update-condition/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["condition"],
    }),
    // DELETE CONDITION
    deleteCondition: builder.mutation({
      query: (id) => ({
        url: `/condition/delete-condition/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["condition"],
    }),
  }),
});

export const {
  useAddConditionMutation,
  useDeleteConditionMutation,
  useGetConditionsQuery,
  useGetSingleConditionQuery,
  useUpdateConditionMutation,
} = conditionApi;
