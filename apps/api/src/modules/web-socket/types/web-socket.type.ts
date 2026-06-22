import { Socket } from "socket.io";

export type TSocketUser = {
  id: string;
  email: string;
  name: string | null;
};

export type TAuthenticatedSocket = Socket & {
  user?: TSocketUser;
};

export type TJoinConversationPayload = {
  conversationId: string;
};

export type TMessageCreatedPayload = {
  conversationId: string;
  message: {
    id: string;
    content: string;
    conversationId: string;
    createdAt: Date | string;
    role: "USER" | "ASSISTANT" | "SYSTEM";
  };
};

export type TMessageErrorPayload = {
  message: string;
  conversationId: string;
};
