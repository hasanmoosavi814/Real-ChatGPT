import { WebSocketLogMessages } from "@web-socket/enums/web-socket-message.enum";
import { Logger, UseGuards } from "@nestjs/common";
import { WebSocketService } from "@web-socket/services/web-socket.service";
import { WebSocketEvents } from "@web-socket/enums/web-socket-message.enum";
import { WsAuthGuard } from "@web-socket/guards/ws-auth.guard";
import { Server } from "socket.io";

import * as T from "@web-socket/types/web-socket.type";
import * as W from "@nestjs/websockets";

@W.WebSocketGateway({
  cors: {
    origin: process.env.WEB_ORIGIN,
    credentials: true,
  },
})
export class ChatGateway
  implements W.OnGatewayInit, W.OnGatewayConnection, W.OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  @W.WebSocketServer()
  private readonly server!: Server;

  constructor(private readonly webSocketService: WebSocketService) {}

  afterInit(server: Server): void {
    this.webSocketService.setServer(server);
    this.logger.log(WebSocketLogMessages.CHAT_GATEWAY_INIT);
  }

  handleConnection(client: T.TAuthenticatedSocket): void {
    this.webSocketService.handleConnection(client);
  }

  handleDisconnect(client: T.TAuthenticatedSocket): void {
    this.webSocketService.handleDisconnect(client);
  }

  @UseGuards(WsAuthGuard)
  @W.SubscribeMessage(WebSocketEvents.AUTH_PING)
  handleAuthPing(@W.ConnectedSocket() client: T.TAuthenticatedSocket) {
    return this.webSocketService.handleAuthPing(client);
  }

  @UseGuards(WsAuthGuard)
  @W.SubscribeMessage(WebSocketEvents.CONVERSATION_JOIN)
  handleJoinConversation(
    @W.ConnectedSocket() client: T.TAuthenticatedSocket,
    @W.MessageBody() payload: T.TJoinConversationPayload,
  ) {
    return this.webSocketService.joinConversation(client, payload);
  }
}
