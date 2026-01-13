import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const simApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD
    addSim: builder.mutation({
      query: (data) => ({
        url: "/sim/create-sim",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["sim"],
    }),
    // GET ALL SIMS
    getSims: builder.query({
      query: (data) => ({
        url: `/sim/get-sim-all?page=${data?.page || 1}&size=${data?.size || fallback.querySize}&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["sim"],
    }),
    // GET SINGLE SIM
    getSingleSim: builder.query({
      query: (id) => ({
        url: `/sim/get-sim-by-id/${id}`,
      }),
      providesTags: ["sim"],
    }),

    // UPDATE SIM
    updateSim: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sim/update-sim/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["sim"],
    }),
    // DELETE SIM
    deleteSim: builder.mutation({
      query: (id) => ({
        url: `/sim/delete-sim/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sim"],
    }),
  }),
});

export const {
  useAddSimMutation,
  useDeleteSimMutation,
  useGetSingleSimQuery,
  useGetSimsQuery,
  useUpdateSimMutation,
} = simApi;
