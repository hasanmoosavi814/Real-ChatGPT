export enum WebSocketErrorMessages {
  UNAUTHORIZED = "Unauthorized.",
  CONVERSATION_ID_REQUIRED = "conversationId is required.",
  SERVER_NOT_INITIALIZED = "Cannot emit event because Socket.IO server is not initialized.",
}

export enum WebSocketEvents {
  AUTH_PING = "auth:ping",
  AUTH_PONG = "auth:pong",
  MESSAGE_ERROR = "message:error",
  CONVERSATION_JOIN = "conversation:join",
  CONVERSATION_JOINED = "conversation:joined",
  MESSAGE_USER_CREATED = "message:user_created",
  CONVERSATION_JOIN_ERROR = "conversation:join:error",
  MESSAGE_ASSISTANT_CREATED = "message:assistant_created",
}

export const WebSocketLogMessages = {
  SERVER_REGISTERED: "Socket.IO server instance registered.",
  CHAT_GATEWAY_INIT: "ChatGateway initialized.",
  CONNECTED: (socketId: string) => `Socket connected: socketId=${socketId}`,
  DISCONNECTED: (socketId: string, userId: string) =>
    `Socket disconnected: socketId=${socketId} userId=${userId}`,
  AUTHENTICATED: (socketId: string, userId: string) =>
    `Socket authenticated: socketId=${socketId} userId=${userId}`,
  JOINED_CONVERSATION: (
    socketId: string,
    userId: string,
    conversationId: string,
  ) =>
    `Socket joined conversation: socketId=${socketId} userId=${userId} conversationId=${conversationId}`,
} as const;
