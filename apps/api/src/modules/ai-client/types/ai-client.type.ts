import { MessageRole } from "@prisma/client";

export type TAiClientMessage = {
  role: MessageRole;
  content: string;
};

export type TGenerateAiResponseRequest = {
  conversationId: string;
  messages: TAiClientMessage[];
};

export type TGenerateAiResponseResult = {
  content: string;
  role: MessageRole;
};

export type TAiServiceResponse = {
  role?: string;
  content?: string;
};
