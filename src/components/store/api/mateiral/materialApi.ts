import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const materialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD MATERIAL
    addMaterial: builder.mutation({
      query: (data) => ({
        url: "/strap-material/create-strap-material",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["material"],
    }),

    // GET ALL MATERIALS
    getMaterials: builder.query({
      query: (data) => ({
        url: `/strap-material/get-strap-material-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["material"],
    }),

    // GET SINGLE MATERIAL
    getSingleMaterial: builder.query({
      query: (id) => ({
        url: `/strap-material/get-strap-material-by-id/${id}`,
      }),
      providesTags: ["material"],
    }),

    // UPDATE MATERIAL
    updateMaterial: builder.mutation({
      query: ({ id, data }) => ({
        url: `/strap-material/update-strap-material/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["material"],
    }),

    // DELETE MATERIAL
    deleteMaterial: builder.mutation({
      query: (id) => ({
        url: `/strap-material/delete-strap-material/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["material"],
    }),
  }),
});

export const {
  useAddMaterialMutation,
  useDeleteMaterialMutation,
  useGetMaterialsQuery,
  useGetSingleMaterialQuery,
  useUpdateMaterialMutation,
} = materialApi;
