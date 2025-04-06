import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformRequest } from "../utils";
import { RootState } from "../store";

export const tractorApi = createApi({
  reducerPath: "tractorApi",
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
  endpoints: (builder) => ({
    // getInActiveUsers: builder.query({
    //   query: (page) => ({
    //     url: `/api/system/admin-app/inactive-users?page=${page}`,
    //     method: 'GET',
    //   }),
    // //   providesTags: ['users'],
    // }),

    getTractors: builder.query({
      query: (param?: any) => ({
        url: param ?`/tractors/1/${param}` :"/tractors",
        method: "GET",
      }),
    }),
    
    getSearchTractors: builder.query({
      query: (params) => ({
        url: `/tractor_search/${params}`,
        method: "GET",
      }),
    }),

    getEnlistedTractors: builder.query({
      query: (user_id) => ({
        url: `/enlisted_tractors/${user_id}`,
        method: "GET",
      }),
    }),

    getHiredTractors: builder.query({
      query: (user_id) => ({
        url: `/hired_tractors/${user_id}`,
        method: "GET",
      }),
    }),

    hireTractor: builder.mutation({
      query: (data: any) => ({
        url: "/hire_a_tractor",
        method: "POST",
        body: transformRequest(data),
      }),
    }),

    registerAsVendor: builder.mutation({
      query: (data: any) => ({
        url: "/become_a_vendor",
        method: "POST",
        body: transformRequest(data),
      }),
    }),
  }),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTractorsQuery,
  useLazyGetTractorsQuery,
  useLazyGetSearchTractorsQuery,
  useGetEnlistedTractorsQuery,
  useGetHiredTractorsQuery,
  useHireTractorMutation,
  useRegisterAsVendorMutation,
} = tractorApi;
