export enum GenerateStaticMessages {
  NO_USER_MESSAGE = "Mock AI response: I did not receive a user message to respond to.",
  PROVIDER = "mock-ai-service",
}

export const GenerateMessageBuilder = {
  deterministicResponse: (message: string) =>
    `Mock AI response: You said "${message}". This is a deterministic response from the external AI service.`,
  logGenerated: (conversationId: string, count: number) =>
    `Generated mock response for conversationId=${conversationId}, messages=${count}`,
};
