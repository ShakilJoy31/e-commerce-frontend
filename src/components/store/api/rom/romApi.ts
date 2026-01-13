import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const romApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD 
    addRom: builder.mutation({
      query: (data) => ({
        url: "/rom/create-rom",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["rom"],
    }),
    // GET ALL ROMS
    getRoms: builder.query({
      query: (data) => ({
        url: `/rom/get-rom-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["rom"],
    }),
    // GET SINGLE ROM
    getSingleRom: builder.query({
      query: (id) => ({
        url: `/rom/get-rom-by-id/${id}`,
      }),
      providesTags: ["rom"],
    }),
    
    // UPDATE ROM
    updateRom: builder.mutation({
      query: ({ id, data }) => ({
        url: `/rom/update-rom/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["rom"],
    }),
    // DELETE ROM
    deleteRom: builder.mutation({
      query: (id) => ({
        url: `/rom/delete-rom/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["rom"],
    }),
  }),
});

export const { 
  useAddRomMutation, 
  useDeleteRomMutation, 
  useGetSingleRomQuery, 
  useGetRomsQuery, 
  useUpdateRomMutation 
} = romApi;
