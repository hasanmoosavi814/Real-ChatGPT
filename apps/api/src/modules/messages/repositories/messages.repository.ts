import { TCreateMessageInput } from "@messages/types/message.type";
import { PrismaService } from "@prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Message } from "@prisma/client";

@Injectable()
export class MessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: TCreateMessageInput): Promise<Message> {
    return this.prisma.message.create({
      data: {
        conversationId: input.conversationId,
        role: input.role,
        content: input.content,
      },
    });
  }

  findManyByConversationId(conversationId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findRecentByConversationId(params: {
    conversationId: string;
    limit: number;
  }): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId: params.conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: params.limit,
    });

    return messages.reverse();
  }

  async touchConversation(conversationId: string): Promise<void> {
    return this.prisma.conversation
      .update({
        where: {
          id: conversationId,
        },
        data: {
          updatedAt: new Date(),
        },
      })
      .then(() => undefined);
  }
}
