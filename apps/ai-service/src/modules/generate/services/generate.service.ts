import { TGenerateResponseResult } from "@generate/types/generate.type";
import { GenerateMessageBuilder } from "@generate/enum/generate-message.enum";
import { GenerateStaticMessages } from "@generate/enum/generate-message.enum";
import { GenerateResponseDto } from "@generate/dtos/generate-response.dto";
import { Injectable, Logger } from "@nestjs/common";
import { AiMessageRole } from "@generate/enum/generate.enum";

@Injectable()
export class GenerateService {
  private readonly logger = new Logger(GenerateService.name);

  generate(dto: GenerateResponseDto): TGenerateResponseResult {
    const latestUserMessage = this.getLatestUserMessage(dto.messages);
    const model = dto.model ?? "mock-deterministic-v1";
    const content = this.buildDeterministicResponse(latestUserMessage);
    this.logger.log(
      GenerateMessageBuilder.logGenerated(
        dto.conversationId,
        dto.messages.length,
      ),
    );
    return {
      role: AiMessageRole.ASSISTANT,
      content,
      metadata: {
        provider: GenerateStaticMessages.PROVIDER,
        model,
        inputMessageCount: dto.messages.length,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  private getLatestUserMessage(
    messages: GenerateResponseDto["messages"],
  ): string {
    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === AiMessageRole.USER);
    return latestUserMessage?.content?.trim() || "";
  }

  private buildDeterministicResponse(latestUserMessage: string): string {
    if (!latestUserMessage) return GenerateStaticMessages.NO_USER_MESSAGE;
    return GenerateMessageBuilder.deterministicResponse(
      latestUserMessage.trim(),
    );
  }
}
