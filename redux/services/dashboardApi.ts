import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformRequest } from "../utils";
import { RootState } from "../store";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    // base url of backend API
    baseUrl: "https://backend-v6.onrender.com/api/v1",

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

    getInvestments: builder.query({
      query: (user_id) => ({
        // url: `/get_investments`,
        url: `/get_investments/${user_id}`,
        method: "GET",
      }),
    }),

    getLandsProcessed: builder.query({
      query: (user_id) => ({
        url: `/get_land_processed/${user_id}`,
        method: "GET",
      }),
    }),

    getServicedHours: builder.query({
      query: (user_id) => ({
        url: `/get_serviced_hour/${user_id}`,
        method: "GET",
      }),
    }),

    getDemandGenerated: builder.query({
        query: (user_id) => ({
          url: `/get_demand_generated/${user_id}`,
          method: "GET",
        }),
      }),

      getDemandFulfilled: builder.query({
        query: (user_id) => ({
          url: `/get_demand_fulfilled/${user_id}`,
          method: "GET",
        }),
      }),

      getRevenueGenerated: builder.query({
        query: (user_id) => ({
          url: `/get_revenue_generated/${user_id}`,
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
  }),
});

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetInvestmentsQuery,
  useGetLandsProcessedQuery,
  useGetServicedHoursQuery,
  useGetDemandFulfilledQuery,
  useGetDemandGeneratedQuery,
  useGetRevenueGeneratedQuery,
//   useHireTractorMutation,
} = dashboardApi;
