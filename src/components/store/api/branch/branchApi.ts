import { apiSlice } from "../../rootApi/apiSlice";

export const branchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE branch
    addBranch: builder.mutation({
      query: (data) => ({
        url: "/branch/create-branch",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branch"],
    }),

    // GET all branches with pagination and search
    getBranches: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/branch/get-branch-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["branch"],
    }),

    // GET branch by ID
    getBranchById: builder.query({
      query: (id) => ({
        url: `/branch/get-branch-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["branch"],
    }),

    // UPDATE branch by ID
    updateBranch: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/branch/update-branch/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["branch"],
    }),

    // DELETE branch by ID
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/branch/delete-branch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branch"],
    }),
  }),
});

export const {
  useAddBranchMutation,
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi;
