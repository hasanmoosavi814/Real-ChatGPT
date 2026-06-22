import { Injectable, NotFoundException } from "@nestjs/common";
import { ConversationErrorMessages } from "@conversations/enums/conversation-message.enum";
import { ConversationsRepository } from "@conversations/repositories/conversations.repository";
import { CreateConversationDto } from "@conversations/dtos/create-conversations.dto";
import { UpdateConversationDto } from "@conversations/dtos/update-conversations.dto";
import { TConversationListItem } from "@conversations/types/conversations.type";
import { ConversationDefaults } from "@conversations/enums/conversation-message.enum";
import { ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Conversation } from "@prisma/client";
import { CacheService } from "@cache/services/cache.service";
import { CacheKeys } from "@utils/cache.keys";

@Injectable()
export class ConversationsService {
  private readonly conversationListCacheTtlSeconds: number;

  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.conversationListCacheTtlSeconds =
      this.configService.get<number>("CONVERSATION_LIST_CACHE_TTL_SECONDS") ??
      ConversationDefaults.DEFAULT_CACHE_TTL_SECONDS;
  }

  async create(
    userId: string,
    dto: CreateConversationDto,
  ): Promise<Conversation> {
    const title = this.normalizeTitle(dto.title);
    const conversation = await this.conversationsRepository.create({
      userId,
      title,
    });
    await this.invalidateUserConversationsCache(userId);
    return conversation;
  }

  async findAllForUser(userId: string): Promise<TConversationListItem[]> {
    const cacheKey = CacheKeys.userConversations(userId);
    const cached =
      await this.cacheService.get<TConversationListItem[]>(cacheKey);
    if (cached) return cached;
    const conversations =
      await this.conversationsRepository.findManyByUserId(userId);
    const result: TConversationListItem[] = conversations.map(
      (conversation) => ({
        id: conversation.id,
        title: conversation.title,
        userId: conversation.userId,
        messageCount: conversation._count.messages,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      }),
    );
    await this.cacheService.set(
      cacheKey,
      result,
      this.conversationListCacheTtlSeconds,
    );
    return result;
  }

  async findOneForUser(
    conversationId: string,
    userId: string,
  ): Promise<TConversationListItem> {
    const conversation = await this.conversationsRepository.findByIdAndUserId({
      id: conversationId,
      userId,
    });
    if (!conversation)
      throw new NotFoundException(ConversationErrorMessages.NOT_FOUND);
    return {
      id: conversation.id,
      title: conversation.title,
      userId: conversation.userId,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messageCount: conversation._count.messages,
    };
  }

  async updateTitleForUser(
    conversationId: string,
    userId: string,
    dto: UpdateConversationDto,
  ): Promise<Conversation> {
    await this.ensureConversationBelongsToUser(conversationId, userId);
    const conversation = await this.conversationsRepository.updateTitle({
      id: conversationId,
      userId,
      title:
        this.normalizeTitle(dto.title) ?? ConversationDefaults.DEFAULT_TITLE,
    });
    await this.invalidateUserConversationsCache(userId);
    return conversation;
  }

  async deleteForUser(
    conversationId: string,
    userId: string,
  ): Promise<{ success: true }> {
    await this.ensureConversationBelongsToUser(conversationId, userId);
    await this.conversationsRepository.deleteById(conversationId);
    await this.cacheService.deleteMany([
      CacheKeys.userConversations(userId),
      CacheKeys.conversationMessages(conversationId),
    ]);
    return { success: true };
  }

  async ensureConversationBelongsToUser(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const exists = await this.conversationsRepository.existsForUser({
      id: conversationId,
      userId,
    });
    if (!exists)
      throw new ForbiddenException(ConversationErrorMessages.FORBIDDEN);
  }

  async invalidateUserConversationsCache(userId: string): Promise<void> {
    await this.cacheService.delete(CacheKeys.userConversations(userId));
  }

  private normalizeTitle(title?: string | null): string | null {
    if (!title) return null;
    const trimmed = title.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
