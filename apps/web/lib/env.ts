export const env = {
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  aiServiceBaseUrl: process.env.NEXT_PUBLIC_AI_SERVICE_BASE_URL,
} as const;
