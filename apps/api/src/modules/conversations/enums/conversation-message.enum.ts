export enum ConversationErrorMessages {
  NOT_FOUND = "Conversation was not found.",
  FORBIDDEN = "You do not have access to this conversation.",
}

export enum ConversationDefaults {
  DEFAULT_TITLE = "New Chat",
  DEFAULT_CACHE_TTL_SECONDS = 60,
}

export const ConversationLogMessages = {
  created: (userId: string) => `Conversation created for user=${userId}`,
  cacheHit: (userId: string) => `Conversations cache hit for user=${userId}`,
  cacheMiss: (userId: string) => `Conversations cache miss for user=${userId}`,
  cacheInvalidated: (userId: string) =>
    `Conversations cache invalidated for user=${userId}`,
  deleted: (conversationId: string) =>
    `Conversation deleted: ${conversationId}`,
  updatedTitle: (conversationId: string) =>
    `Conversation title updated: ${conversationId}`,
};
