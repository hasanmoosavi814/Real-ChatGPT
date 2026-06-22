export type Conversation = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  title: string | null;
};

export type ConversationListItem = Conversation & {
  messageCount: number;
};

export type CreateConversationRequest = {
  title?: string;
};

export type UpdateConversationRequest = {
  title: string;
  conversationId: string;
};

export type DeleteConversationResponse = {
  success: true;
};
