import { api } from "./api";

import * as T from "@/types/conversation";

export const conversationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation<
      T.Conversation,
      T.CreateConversationRequest
    >({
      query: (body) => ({
        url: "/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Conversation"],
    }),

    getConversations: builder.query<T.ConversationListItem[], void>({
      query: () => "/conversations",
      providesTags: (result) =>
        result
          ? [
              ...result.map((conversation) => ({
                type: "Conversation" as const,
                id: conversation.id,
              })),
              { type: "Conversation" as const, id: "LIST" },
            ]
          : [{ type: "Conversation" as const, id: "LIST" }],
    }),

    getConversation: builder.query<T.ConversationListItem, string>({
      query: (conversationId) => `/conversations/${conversationId}`,
      providesTags: (_result, _error, conversationId) => [
        { type: "Conversation", id: conversationId },
      ],
    }),

    updateConversation: builder.mutation<
      T.Conversation,
      T.UpdateConversationRequest
    >({
      query: ({ conversationId, title }) => ({
        url: `/conversations/${conversationId}`,
        method: "PATCH",
        body: { title },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Conversation", id: arg.conversationId },
        { type: "Conversation", id: "LIST" },
      ],
    }),

    deleteConversation: builder.mutation<T.DeleteConversationResponse, string>({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversation", "Message"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetConversationQuery,
  useGetConversationsQuery,
  useUpdateConversationMutation,
  useCreateConversationMutation,
  useDeleteConversationMutation,
} = conversationsApi;
