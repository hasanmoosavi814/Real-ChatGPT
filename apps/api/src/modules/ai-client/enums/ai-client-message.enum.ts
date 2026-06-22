export enum AiClientErrorMessages {
  AI_URL_NOT_DEFINED = "AI_SERVICE_URL is not defined.",
  INVALID_AI_CONTENT = "AI service returned invalid content.",
  AI_UNAVAILABLE = "AI service is unavailable or returned an invalid response.",
  AI_TIMEOUT_OR_FAILED = "AI service request failed or timed out.",
}

export const AiClientLogMessages = {
  callingService: (conversationId: string) =>
    `Calling AI service for conversationId=${conversationId}`,

  respondedIn: (conversationId: string, durationMs: number) =>
    `AI service responded in ${durationMs}ms for conversationId=${conversationId}`,

  failedAfter: (conversationId: string, durationMs: number) =>
    `AI service failed after ${durationMs}ms for conversationId=${conversationId}`,
};
