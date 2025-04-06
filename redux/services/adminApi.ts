import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformRequest } from "../utils";
import { RootState } from "../store";
// import { baseUrl } from 'src/utils/helpers'

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    // base url of backend API
    baseUrl: "https://tractrac.iiimpact.org/v1",

    // prepareHeaders is used to configure the header of every request and gives access to getState which we use to include the token from the store
    prepareHeaders: (headers, { getState }) => {
      console.log((getState() as RootState).auth);
      const authState = (getState() as RootState).auth;
      const token = authState.userToken;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/x-www-form-urlencoded");
      }
      if (token) {
        // include token in req header
        headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
      return headers;
    },
  }),
  tagTypes: ["farmers", "all_enlisted_tractors", "all_hired_tractors", "users"],
  endpoints: (builder) => ({
    getFarmers: builder.query({
      query: () => ({
        url: `/get_farmers`,
        method: "GET",
      }),
      providesTags: ["farmers"],
    }),

    getDashboardStats: builder.query({
      query: () => ({
        url: '/get_admin_dashboard_overview',
        method: "GET",
      }),
    }),

    getEntries: builder.query({
      query: (entry) => ({
        url: `/get_admin_entries/${entry}`,
        method: "GET",
      }),
    }),

    getPayments: builder.query({
      query: () => ({
        url: "/get_admin_payment",
        method: "GET",
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    getSingleTractor: builder.query({
      query: (tractorId) => ({
        url: `/tractors/${tractorId}`,
        method: "GET",
      }),
    }),

    getEnlistedTractors: builder.query({
      query: () => ({
        url: "all_enlisted_tractors",
        method: "GET",
      }),
      providesTags: ["all_enlisted_tractors"],
    }),

    getHiredTractors: builder.query({
      query: () => ({
        url: "get_all_hired_tractors",
        method: "GET",
      }),
      providesTags: ["all_hired_tractors"],
    }),

    getSingleHiredTractor: builder.query({
      query: (tractorId) => ({
        url: `/admin_single_tractor/${tractorId}`,
        method: "GET",
      }),
      providesTags: ["all_hired_tractors"],
    }),

    verifyTractor: builder.mutation({
      query: (data: any) => ({
        url: "/verify_tractor",
        method: "POST",
        body: transformRequest(data),
      }),
      invalidatesTags: ["all_enlisted_tractors"],
    }),

    assignTractor: builder.mutation({
      query: (data: any) => ({
        url: "/assign_tractor",
        method: "POST",
        body: transformRequest(data),
      }),
      invalidatesTags: ["all_hired_tractors"],
    }),

    addFarmer: builder.mutation({
      query: (data: any) => ({
        url: "/add_farmer",
        method: "POST",
        body: transformRequest(data),
      }),
      invalidatesTags: ["farmers"],
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

    deleteUser: builder.mutation({
      query: (data: any) => ({
        url: "/admin_delete_user",
        method: "POST",
        body: transformRequest(data),
      }),
      invalidatesTags: ["users"],
    }),


    updateUserRole: builder.mutation({
      query: (data: any) => ({
        url: "/admin_update_user_role",
        method: "POST",
        body: transformRequest(data),
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetFarmersQuery,
  useGetDashboardStatsQuery,
  useGetEntriesQuery,
  useGetPaymentsQuery,
  useGetEnlistedTractorsQuery,
  useGetHiredTractorsQuery,
  useGetUsersQuery,
  useLazyGetSingleHiredTractorQuery,
  useLazyGetSingleTractorQuery,

  useAssignTractorMutation,
  useVerifyTractorMutation,
  useAddFarmerMutation,
  useUpdateBioDataMutation,
  useUpdatePasswordMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation
} = adminApi;
