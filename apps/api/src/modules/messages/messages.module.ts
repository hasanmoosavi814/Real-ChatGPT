import { ConversationsModule } from "@conversations/conversations.module";
import { MessagesRepository } from "@messages/repositories/messages.repository";
import { MessagesController } from "@messages/controllers/messages.controller";
import { WebSocketModule } from "@web-socket/websocket.module";
import { MessagesService } from "@messages/services/messages.service";
import { AiClientModule } from "@ai-client/ai-client.module";
import { AppCacheModule } from "@cache/cache.module";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    PrismaModule,
    AiClientModule,
    AppCacheModule,
    WebSocketModule,
    ConversationsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
