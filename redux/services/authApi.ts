import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformRequest } from "../utils";
// import { baseUrl } from 'src/utils/helpers'

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    // base url of backend API
    baseUrl: "https://tractrac.iiimpact.org/v1",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/x-www-form-urlencoded");
      return headers;
    },

    // prepareHeaders is used to configure the header of every request and gives access to getState which we use to include the token from the store
    // prepareHeaders: (headers, { getState }) => {
    //   console.log(getState().auth)
    //   const token = getState().auth.userToken
    //   if (token) {
    //     // include token in req header
    //     headers.set('authorization', `Bearer ${token}`)
    //     return headers
    //   }
    // },
  }),
  endpoints: (builder) => ({
    // getActiveUsers: builder.query({
    //   query: (page) => ({
    //     url: `/api/system/admin-app/users?page=${page}`,
    //     method: 'GET',
    //   }),
    // //   providesTags: ['users'],
    // }),
    // getInActiveUsers: builder.query({
    //   query: (page) => ({
    //     url: `/api/system/admin-app/inactive-users?page=${page}`,
    //     method: 'GET',
    //   }),
    // //   providesTags: ['users'],
    // }),
    // getUser: builder.query({
    //   query: (userId) => ({
    //     url: `/api/system/admin-app/user/${userId}`,
    //     method: 'GET',
    //   }),
    // }),
    loginUser: builder.mutation({
      query: ({ phone, password }) => ({
        url: "/login",
        method: "POST",
        body: transformRequest({ phone, password }),
      }),
      //   invalidatesTags: ['users'],
    }),
    loginAdmin: builder.mutation({
      query: ({ phone, password }) => ({
        url: "/admin_login",
        method: "POST",
        body: transformRequest({ phone, password }),
      }),
      //   invalidatesTags: ['users'],
    }),
    registerUser: builder.mutation({
      query: (data: any) => ({
        url: "/register",
        method: "POST",
        body: transformRequest(data),
      }),
      //   invalidatesTags: ['users'],
    }),
    verifyOtp: builder.mutation({
      query: ({ otp, phone }) => ({
        url: "/verify_otp",
        method: "POST",
        body: transformRequest({ otp, phone }),
      }),
      //   invalidatesTags: ['users'],
    }),
    sendOtp: builder.mutation({
      query: ({ type, phone }) => ({
        url: "/send_otp",
        method: "POST",
        body: transformRequest({ type, phone }),
      }),
      //   invalidatesTags: ['users'],
    }),
    resendOtp: builder.mutation({
      query: ({ type, phone }) => ({
        url: "/resend_otp",
        method: "POST",
        body: transformRequest({ type, phone }),
      }),
      //   invalidatesTags: ['users'],
    }),
    resetPassword: builder.mutation({
      query: ({ otp, phone, password, confirm_password }) => ({
        url: "/reset_password",
        method: "POST",
        body: transformRequest({ otp, phone, password, confirm_password }),
      }),
      //   invalidatesTags: ['users'],
    }),
  }),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  //   useLazyGetActiveUsersQuery,
  //   useLazyGetUserQuery,
  useLoginUserMutation,
  useLoginAdminMutation,
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useSendOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} = authApi;
// export const { useGetActiveUsersQuery } = userApi
