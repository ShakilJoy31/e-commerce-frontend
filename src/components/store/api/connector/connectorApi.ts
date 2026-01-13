import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const connectorTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD CONNECTOR-TYPE
    addConnectorType: builder.mutation({
      query: (data) => ({
        url: "/connector-type/create-connector-type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["connector-type"],
    }),

    // GET ALL CONNECTOR-TYPES
    getConnectorTypes: builder.query({
      query: (data) => ({
        url: `/connector-type/get-connector-type-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["connector-type"],
    }),

    // GET SINGLE CONNECTOR-TYPE
    getSingleConnectorType: builder.query({
      query: (id) => ({
        url: `/connector-type/get-connector-type-by-id/${id}`,
      }),
      providesTags: ["connector-type"],
    }),

    // UPDATE CONNECTOR-TYPE
    updateConnectorType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/connector-type/update-connector-type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["connector-type"],
    }),

    // DELETE CONNECTOR-TYPE
    deleteConnectorType: builder.mutation({
      query: (id) => ({
        url: `/connector-type/delete-connector-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["connector-type"],
    }),
  }),
});

export const {
  useAddConnectorTypeMutation,
  useDeleteConnectorTypeMutation,
  useGetConnectorTypesQuery,
  useGetSingleConnectorTypeQuery,
  useUpdateConnectorTypeMutation,
} = connectorTypeApi;
