import { Conversation } from "@prisma/client";

export type TConversationListItem = {
  id: string;
  userId: string;
  title: string | null;
  messageCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type TConversationWithCount = Conversation & {
  _count: {
    messages: number;
  };
};
