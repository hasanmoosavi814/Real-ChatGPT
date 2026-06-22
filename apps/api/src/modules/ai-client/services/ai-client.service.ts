import { Logger, ServiceUnavailableException } from "@nestjs/common";
import { BadGatewayException, Injectable } from "@nestjs/common";
import { firstValueFrom, timeout } from "rxjs";
import { AiClientErrorMessages } from "@ai-client/enums/ai-client-message.enum";
import { AiClientLogMessages } from "@ai-client/enums/ai-client-message.enum";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { MessageRole } from "@prisma/client";
import { AxiosError } from "axios";

import * as T from "@ai-client/types/ai-client.type";

@Injectable()
export class AiClientService {
  private readonly logger = new Logger(AiClientService.name);
  private readonly aiServiceUrl: string;
  private readonly timeoutMs: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const aiServiceUrl = this.configService.get<string>("AI_SERVICE_URL");
    if (!aiServiceUrl)
      throw new Error(AiClientErrorMessages.AI_URL_NOT_DEFINED);
    this.aiServiceUrl = aiServiceUrl.replace(/\/$/, "");
    this.timeoutMs = Number(
      this.configService.get<number>("AI_SERVICE_TIMEOUT_MS") ?? 10000,
    );
  }

  async generateResponse(
    request: T.TGenerateAiResponseRequest,
  ): Promise<T.TGenerateAiResponseResult> {
    const startedAt = Date.now();
    try {
      this.logger.log(
        AiClientLogMessages.callingService(request.conversationId),
      );
      const response = await firstValueFrom(
        this.httpService
          .post<T.TAiServiceResponse>(`${this.aiServiceUrl}/generate`, request)
          .pipe(timeout(this.timeoutMs)),
      );
      const durationMs = Date.now() - startedAt;
      this.logger.log(
        AiClientLogMessages.respondedIn(request.conversationId, durationMs),
      );
      return this.normalizeAiResponse(response.data);
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      this.logger.error(
        AiClientLogMessages.failedAfter(request.conversationId, durationMs),
        error instanceof Error ? error.stack : undefined,
      );
      if (this.isAxiosError(error))
        throw new BadGatewayException(AiClientErrorMessages.AI_UNAVAILABLE);
      throw new ServiceUnavailableException(
        AiClientErrorMessages.AI_TIMEOUT_OR_FAILED,
      );
    }
  }

  private normalizeAiResponse(
    response: T.TAiServiceResponse,
  ): T.TGenerateAiResponseResult {
    if (!response?.content || typeof response.content !== "string")
      throw new BadGatewayException(AiClientErrorMessages.INVALID_AI_CONTENT);
    return {
      role: MessageRole.ASSISTANT,
      content: response.content.trim(),
    };
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return Boolean(
      typeof error === "object" && error !== null && "isAxiosError" in error,
    );
  }
}
