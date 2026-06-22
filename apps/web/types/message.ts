export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export type Message = {
  id: string;
  content: string;
  role: MessageRole;
  createdAt: string;
  conversationId: string;
};

export type SendMessageRequest = {
  content: string;
  conversationId: string;
};

export type SendMessageResponse = {
  userMessage: Message;
  assistantMessage: Message;
};
