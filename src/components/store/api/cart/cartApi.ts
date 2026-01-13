
import { apiSlice } from "../../rootApi/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCartProducts: builder.query({
      query: () => ({
        url: `/cart/get-cart`,
      }),
      providesTags: ["cart"],
    }),

    //   Add products in cart
    addToCart: builder.mutation({
      query: (data) => ({
        url: `/cart/add-cart`,
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: ["cart"],
    }),

    updateCart: builder.mutation({
      query: ({ cartId, quantity }) => ({
        url: `/cart/update-cart/${cartId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["cart", "products"],
    }),
    updateColor: builder.mutation({
      query: ({ cartId, data }) => ({
        url: `/cart/update-color/${cartId}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["cart", "products"],
    }),
    updateSize: builder.mutation({
      query: ({ cartId, data }) => ({
        url: `/cart/update-size/${cartId}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["cart", "products"],
    }),

    //remove from cart
    removeCart: builder.mutation({
      query: (data) => ({
        url: `/cart/delete-cart/${data?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),

    // clear cart
    clearCart: builder.mutation({
      query: () => ({
        url: `/cart`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),

    createOrder: builder.mutation({
      query: (data) => ({
        url: `/cart/create-order`,
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: ["cart", "products"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useRemoveCartMutation,
  useGetCartProductsQuery,
  useUpdateCartMutation,
  useClearCartMutation,
  useUpdateColorMutation,
  useUpdateSizeMutation,
  useCreateOrderMutation,
} = cartApi;
