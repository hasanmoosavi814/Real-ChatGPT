import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AiServiceHealthResponse } from "@/types/health";
import { HealthResponse } from "@/types/health";
import { api } from "./api";
import { env } from "@/lib/env";

export const healthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    liveHealth: builder.query<HealthResponse, void>({
      query: () => "/health/live",
      providesTags: ["Health"],
    }),
    readyHealth: builder.query<HealthResponse, void>({
      query: () => "/health/ready",
      providesTags: ["Health"],
    }),
  }),
  overrideExisting: false,
});

export const aiHealthApi = createApi({
  reducerPath: "aiHealthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: env.aiServiceBaseUrl,
  }),
  endpoints: (builder) => ({
    aiHealth: builder.query<AiServiceHealthResponse, void>({
      query: () => "/health",
    }),
  }),
});

export const { useLiveHealthQuery, useReadyHealthQuery } = healthApi;
export const { useAiHealthQuery } = aiHealthApi;
