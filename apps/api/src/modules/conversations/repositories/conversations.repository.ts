import { TConversationWithCount } from "@conversations/types/conversations.type";
import { PrismaService } from "@prisma/prisma.service";
import { Conversation } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConversationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(params: {
    userId: string;
    title?: string | null;
  }): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        userId: params.userId,
        title: params.title ?? "New Chat",
      },
    });
  }

  findManyByUserId(userId: string): Promise<TConversationWithCount[]> {
    return this.prisma.conversation.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  }

  findByIdAndUserId(params: {
    id: string;
    userId: string;
  }): Promise<TConversationWithCount | null> {
    return this.prisma.conversation.findFirst({
      where: {
        id: params.id,
        userId: params.userId,
      },
      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  }

  updateTitle(params: {
    id: string;
    userId: string;
    title: string;
  }): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: {
        id_userId: {
          id: params.id,
          userId: params.userId,
        },
      },
      data: {
        title: params.title,
      },
    });
  }

  deleteById(id: string): Promise<Conversation> {
    return this.prisma.conversation.delete({
      where: {
        id,
      },
    });
  }

  touch(id: string): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: {
        id,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  countByUserId(userId: string): Promise<number> {
    return this.prisma.conversation.count({
      where: {
        userId,
      },
    });
  }

  async existsForUser(params: {
    id: string;
    userId: string;
  }): Promise<boolean> {
    return this.prisma.conversation
      .count({
        where: {
          id: params.id,
          userId: params.userId,
        },
      })
      .then((count) => count > 0);
  }
}
