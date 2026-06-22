import { ServiceUnavailableException } from "@nestjs/common";
import { Message, MessageRole } from "@prisma/client";
import { ConversationsService } from "@conversations/services/conversations.service";
import { Injectable, Logger } from "@nestjs/common";
import { TSendMessageResult } from "@messages/types/message.type";
import { MessagesRepository } from "@messages/repositories/messages.repository";
import { WebSocketService } from "@web-socket/services/web-socket.service";
import { AiClientService } from "@ai-client/services/ai-client.service";
import { SendMessageDto } from "@messages/dtos/send.messages.dto";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "@cache/services/cache.service";
import { CacheKeys } from "@utils/cache.keys";

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  private readonly aiContextLimit = 20;
  private readonly messageHistoryCacheTtlSeconds: number;

  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly chatGateway: WebSocketService,
    private readonly aiClientService: AiClientService,
    private readonly messagesRepository: MessagesRepository,
    private readonly conversationsService: ConversationsService,
  ) {
    this.messageHistoryCacheTtlSeconds =
      this.configService.get<number>("MESSAGE_HISTORY_CACHE_TTL_SECONDS") ?? 30;
  }

  async findHistoryForUser(params: {
    conversationId: string;
    userId: string;
  }): Promise<Message[]> {
    await this.conversationsService.ensureConversationBelongsToUser(
      params.conversationId,
      params.userId,
    );
    const cacheKey = CacheKeys.conversationMessages(params.conversationId);
    const cachedMessages = await this.cacheService.get<Message[]>(cacheKey);
    if (cachedMessages) return cachedMessages;
    const messages = await this.messagesRepository.findManyByConversationId(
      params.conversationId,
    );
    await this.cacheService.set(
      cacheKey,
      messages,
      this.messageHistoryCacheTtlSeconds,
    );
    return messages;
  }

  async sendMessage(params: {
    conversationId: string;
    userId: string;
    dto: SendMessageDto;
  }): Promise<TSendMessageResult> {
    const content = this.normalizeContent(params.dto.content);
    await this.conversationsService.ensureConversationBelongsToUser(
      params.conversationId,
      params.userId,
    );
    const userMessage = await this.messagesRepository.create({
      conversationId: params.conversationId,
      role: MessageRole.USER,
      content,
    });
    await this.messagesRepository.touchConversation(params.conversationId);
    await this.invalidateMessageAndConversationCache({
      conversationId: params.conversationId,
      userId: params.userId,
    });
    this.chatGateway.emitUserMessageCreated({
      conversationId: params.conversationId,
      message: {
        id: userMessage.id,
        conversationId: userMessage.conversationId,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
    });
    const recentMessages =
      await this.messagesRepository.findRecentByConversationId({
        conversationId: params.conversationId,
        limit: this.aiContextLimit,
      });
    try {
      const aiResponse = await this.aiClientService.generateResponse({
        conversationId: params.conversationId,
        messages: recentMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      });
      if (!aiResponse.content) {
        this.logger.error(
          `AI service returned empty response for conversationId=${params.conversationId}`,
        );
        throw new ServiceUnavailableException(
          "AI service returned an empty response.",
        );
      }
      const assistantMessage = await this.messagesRepository.create({
        conversationId: params.conversationId,
        role: MessageRole.ASSISTANT,
        content: aiResponse.content,
      });
      await this.messagesRepository.touchConversation(params.conversationId);
      await this.invalidateMessageAndConversationCache({
        conversationId: params.conversationId,
        userId: params.userId,
      });
      this.chatGateway.emitAssistantMessageCreated({
        conversationId: params.conversationId,
        message: {
          id: assistantMessage.id,
          conversationId: assistantMessage.conversationId,
          role: assistantMessage.role,
          content: assistantMessage.content,
          createdAt: assistantMessage.createdAt,
        },
      });
      return {
        userMessage,
        assistantMessage,
      };
    } catch (error) {
      this.chatGateway.emitMessageError({
        conversationId: params.conversationId,
        message: "AI response generation failed.",
      });
      throw error;
    }
  }

  private async invalidateMessageAndConversationCache(params: {
    conversationId: string;
    userId: string;
  }): Promise<void> {
    await this.cacheService.deleteMany([
      CacheKeys.conversationMessages(params.conversationId),
      CacheKeys.userConversations(params.userId),
    ]);
  }

  private normalizeContent(content: string): string {
    return content.trim();
  }
}
