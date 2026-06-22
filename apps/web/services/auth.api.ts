import { api } from "./api";

import type * as T from "@/types/auth";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<T.AuthResponse, T.RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<T.AuthResponse, T.LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<T.LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "Conversation", "Message"],
    }),

    me: builder.query<T.User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useMeQuery,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = authApi;
