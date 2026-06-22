import { api } from "./api";

import * as T from "@/types/message";

export const messagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConversationMessages: builder.query<T.Message[], string>({
      query: (conversationId) => `/conversations/${conversationId}/messages`,
      providesTags: (_result, _error, conversationId) => [
        { type: "Message", id: conversationId },
      ],
    }),

    sendMessage: builder.mutation<T.SendMessageResponse, T.SendMessageRequest>({
      query: ({ conversationId, content }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Message", id: arg.conversationId },
        { type: "Conversation", id: arg.conversationId },
        { type: "Conversation", id: "LIST" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const { useSendMessageMutation, useGetConversationMessagesQuery } =
  messagesApi;
