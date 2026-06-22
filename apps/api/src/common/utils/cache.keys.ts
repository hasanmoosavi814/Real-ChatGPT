export const CacheKeys = {
  userConversations: (userId: string) => `user:${userId}:conversations`,
  conversationMessages: (conversationId: string) =>
    `conversation:${conversationId}:messages`,
  conversationDetail: (conversationId: string, userId: string) =>
    `user:${userId}:conversation:${conversationId}`,
};
