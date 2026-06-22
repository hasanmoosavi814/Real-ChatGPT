import { Message, MessageRole } from "@prisma/client";

export type TCreateMessageInput = {
  content: string;
  role: MessageRole;
  conversationId: string;
};

export type TSendMessageResult = {
  userMessage: Message;
  assistantMessage: Message;
};
