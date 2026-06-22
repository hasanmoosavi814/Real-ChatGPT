import { AiMessageRole } from "@generate/enum/generate.enum";

export type TGenerateResponseResult = {
  content: string;
  role: AiMessageRole.ASSISTANT;
  metadata: {
    model: string;
    generatedAt: string;
    inputMessageCount: number;
    provider: "mock-ai-service";
  };
};
