import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformRequest } from "../utils";
import { RootState } from "../store";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: " https://tractracplus-backend-v6.onrender.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const authState = (getState() as RootState).auth;
      const token = authState.userToken;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/x-www-form-urlencoded");
      }
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
      return headers;
    },
  }),
  tagTypes: ['farmers', 'dashboard', 'stats'],
  keepUnusedDataFor: 60, // Keep unused data for 60 seconds
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // getActiveUsers: builder.query({
    //   query: (page) => ({
    //     url: `/api/system/admin-app/users?page=${page}`,
    //     method: 'GET',
    //   }),
    // //   providesTags: ['users'],
    // }),
    getFarmers: builder.query({
      query: (user_id) => ({
        url: `/get_farmers/${user_id}`,
        method: 'GET',
      }),
      providesTags: ['farmers'],
    }),
    getPersonalStats: builder.query({
      query: (user_id) => ({
        url: `/personal_stats/${user_id}`,
        method: "GET",
      }),
      providesTags: ['stats'],
      keepUnusedDataFor: 120,
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard_stats",
        method: "GET",
      }),
      providesTags: ['dashboard', 'stats'],
      keepUnusedDataFor: 120, // Keep dashboard stats for 2 minutes
    }),
    becomeAnAgent: builder.mutation({
      query: ({ user_id, state, lga, town }) => ({
        url: "/become_an_agent",
        method: "POST",
        body: transformRequest({ user_id, state, lga, town }),
      }),
    }),
    investInTractor: builder.mutation({
      query: (data: any) => ({
        url: "/invest_in_tractor",
        method: "POST",
        body: transformRequest(data),
      }),
    }),
    validateIssamId: builder.mutation({
      query: (data: any) => ({
        url: "/validate_issam_id",
        method: "POST",
        body: transformRequest(data),
      }),
    }),
    collaborate: builder.mutation({
      query: (data: any) => ({
        url: "/collaborate",
        method: "POST",
        body: transformRequest(data),
      }),
    }),
    subscribe: builder.mutation({
      query: (data: any) => ({
        url: "/subscribe",
        method: "POST",
        body: transformRequest(data),
      }),
    }),
    becomeAnOpOrMech: builder.mutation({
      query: (data: any) => ({
        url: "/become_an_operator_or_mech",
        method: "POST",
        // body: data,
        body: transformRequest(data),
        // formData: true,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
    }),
    makePayment: builder.mutation({
      query: (data: any) => ({
        url: "/make_payment",
        method: "POST",
        body: transformRequest(data),
      }),
    }),
    addFarmer: builder.mutation({
      query: (data: any) => ({
        url: "/add_farmer",
        method: "POST",
        body: transformRequest(data),
      }),
      invalidatesTags: ['farmers']
    }),
    updateBioData: builder.mutation({
      query: (data: any) => ({
        url: "/update_biodata",
        method: "POST",
        body: transformRequest(data),
      }),
    }),
    updatePassword: builder.mutation({
      query: (data: any) => ({
        url: "/update_password",
        method: "POST",
        body: transformRequest(data),
      }),
    }),
  }),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  //   useLazyGetActiveUsersQuery,
  useGetFarmersQuery,
  useGetPersonalStatsQuery,
  useGetDashboardStatsQuery,
  useBecomeAnAgentMutation,
  useInvestInTractorMutation,
  useValidateIssamIdMutation,
  useCollaborateMutation,
  useSubscribeMutation,
  useBecomeAnOpOrMechMutation,
  useMakePaymentMutation,
  useAddFarmerMutation,
  useUpdateBioDataMutation,
  useUpdatePasswordMutation,
} = userApi;
// export const { useGetActiveUsersQuery } = userApi
