import { apiSlice } from "../../rootApi/apiSlice";

export const blogTagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE blog tag
    addCourier: builder.mutation({
      query: (data) => ({
        url: "/courier/create-courier",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["courier"],
    }),

    // GET all blog tags with pagination and search
    getTCourier: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/courier/get-courier-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["courier"],
    }),

    // GET blog tag by ID
    getCourierById: builder.query({
      query: (id) => ({
        url: `/courier/get-courier-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["courier"],
    }),

    // UPDATE blog tag by ID
    updateCourier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/courier/update-courier/${id}`,
        method: "PUT", 
        body: data,
      }),
      invalidatesTags: ["courier"],
    }),

    // DELETE blog tag by ID
    deleteCourier: builder.mutation({
      query: (id) => ({
        url: `/courier/delete-courier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courier"],
    }),
  }),
});

export const {
  useAddCourierMutation,
  useGetTCourierQuery,
  useGetCourierByIdQuery,
  useUpdateCourierMutation,
  useDeleteCourierMutation,
} = blogTagApi;
