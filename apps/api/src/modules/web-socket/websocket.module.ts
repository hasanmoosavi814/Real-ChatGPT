import { ConversationsModule } from "@conversations/conversations.module";
import { WebSocketService } from "@web-socket/services/web-socket.service";
import { UsersModule } from "@users/users.module";
import { WsAuthGuard } from "@web-socket/guards/ws-auth.guard";
import { ChatGateway } from "@web-socket/controllers/chat.gateway";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  imports: [JwtModule, UsersModule, ConversationsModule],
  providers: [ChatGateway, WebSocketService, WsAuthGuard],
  exports: [WebSocketService],
})
export class WebSocketModule {}
