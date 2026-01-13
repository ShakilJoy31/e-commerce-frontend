import { apiSlice } from "../rootApi/apiSlice";

export const authenticationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // LOGIN
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login-user",
        method: "POST",
        body: credentials,
      }),
    }),

    loginCustomer: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login-customer",
        method: "POST",
        body: credentials,
      }),
    }),

    // REGISTER USER
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/create-user",
        method: "POST",
        body: userData,
      }),
    }),

    // GET USER BY ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/user/get-user-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    // UPDATE USER
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    // UPDATE BILLING INFO
    updateBillingInfo: builder.mutation({
      query: (data) => ({
        url: `/user/update-billing-info`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    // UPDATE SHIPPING INFO
    // updateShippingInfo: builder.mutation({
    //   query: (data) => ({
    //     url: `/user/update-shipping-info`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["user"],
    // }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    otpGenerate: builder.mutation({
      query: ({ contactNo }) => ({
        url: "/auth/otp-generate",
        method: "POST",
        body: { contactNo },
      }),
    }),

    verifyOtp: builder.mutation({
      query: ({ token, otp }) => ({
        url: `/auth/verify-otp?token=${token}`,
        method: "POST",
        body: { otp },
      }),
    }),
    createCustomer: builder.mutation({
      query: ({ token, userData }) => ({
        url: `/auth/create-customer?token=${token}`,
        method: "POST",
        body: userData,
      }),
    }),
    // FORGOT PASSWORD FLOW
    otpGenerateForget: builder.mutation({
      query: ({ contactNo }) => ({
        url: "/auth/otp-generate-forget",
        method: "POST",
        body: { contactNo },
      }),
    }),

    verifyOtpForget: builder.mutation({
      query: ({ token, otp }) => ({
        url: `/auth/verify-otp-forget?token=${token}`,
        method: "POST",
        body: { otp },
      }),
    }),

    forgetPassword: builder.mutation({
      query: ({ token, newPassword, confirmPassword }) => ({
        url: `/auth/forget-password?token=${token}`,
        method: "POST",
        body: { newPassword, confirmPassword },
      }),
    }),

    forgetPasswordRequest: builder.mutation({
      query: (body) => ({
        url: `/auth/forget-password-request`,
        method: "POST",
        body,
      }),
    }),

    changeUserPasswordByAdmin: builder.mutation({
      query: ({ userId, newPassword, confirmPassword }) => ({
        url: `/auth/change-password-by-admin/${userId}`,
        method: "POST",
        body: { newPassword, confirmPassword },
      }),
    }),

    // Checking if the phone number is already registered
    verifyPhoneNumber: builder.mutation({
      query: ({ phone }) => ({
        url: `/user/get-customer-by-phone/${phone}`,
        method: "GET",
      }),
    }),
  }),
});

// Export all hooks together
export const {
  useLoginMutation,
  useLoginCustomerMutation,
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateBillingInfoMutation, 
  // useUpdateShippingInfoMutation, 
  useChangePasswordMutation,
  useOtpGenerateMutation,
  useVerifyOtpMutation,
  useCreateCustomerMutation,
  useOtpGenerateForgetMutation,
  useVerifyOtpForgetMutation,
  useForgetPasswordMutation,
  useForgetPasswordRequestMutation,
  useChangeUserPasswordByAdminMutation,
  useVerifyPhoneNumberMutation
} = authenticationApi;
