import { ConversationsController } from "@conversations/controllers/conversations.controller";
import { ConversationsRepository } from "@conversations/repositories/conversations.repository";
import { ConversationsService } from "@conversations/services/conversations.service";
import { AppCacheModule } from "@cache/cache.module";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, AppCacheModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository],
  exports: [ConversationsService],
})
export class ConversationsModule {}
