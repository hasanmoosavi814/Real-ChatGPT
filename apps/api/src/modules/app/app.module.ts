import { ConversationsModule } from "@conversations/conversations.module";
import { WebSocketModule } from "@web-socket/websocket.module";
import { AppCacheModule } from "@cache/cache.module";
import { MessagesModule } from "@messages/messages.module";
import { AiClientModule } from "@ai-client/ai-client.module";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "@health/health.module";
import { PrismaModule } from "@prisma/prisma.module";
import { CommonModule } from "@common/common.module";
import { UsersModule } from "@users/users.module";
import { AuthModule } from "@auth/auth.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
    CommonModule,

    AuthModule,
    UsersModule,
    PrismaModule,
    HealthModule,
    AiClientModule,
    MessagesModule,
    WebSocketModule,
    AppCacheModule,
    ConversationsModule,
  ],
})
export class AppModule {}
