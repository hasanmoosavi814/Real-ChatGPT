import { ConversationsService } from "@conversations/services/conversations.service";
import { Injectable, Logger } from "@nestjs/common";
import { Server } from "socket.io";

import * as T from "@web-socket/types/web-socket.type";
import * as E from "@web-socket/enums/web-socket-message.enum";

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name);
  private server: Server | null = null;

  constructor(private readonly conversationsService: ConversationsService) {}

  setServer(server: Server): void {
    this.server = server;
    this.logger.log(E.WebSocketLogMessages.SERVER_REGISTERED);
  }

  handleConnection(client: T.TAuthenticatedSocket): void {
    this.logger.log(E.WebSocketLogMessages.CONNECTED(client.id));
  }

  handleDisconnect(client: T.TAuthenticatedSocket): void {
    const userId = client.user?.id ?? "unknown";
    this.logger.log(E.WebSocketLogMessages.DISCONNECTED(client.id, userId));
  }

  async handleAuthPing(client: T.TAuthenticatedSocket) {
    const user = client.user;
    if (!user) {
      return {
        event: E.WebSocketEvents.AUTH_PONG,
        data: {
          authenticated: false,
        },
      };
    }
    client.join(this.getUserRoom(user.id));
    this.logger.log(E.WebSocketLogMessages.AUTHENTICATED(client.id, user.id));
    return {
      event: E.WebSocketEvents.AUTH_PONG,
      data: {
        authenticated: true,
        user,
      },
    };
  }

  async joinConversation(
    client: T.TAuthenticatedSocket,
    payload: T.TJoinConversationPayload,
  ) {
    const user = client.user;
    if (!user) {
      return {
        event: E.WebSocketEvents.CONVERSATION_JOIN_ERROR,
        data: {
          message: E.WebSocketErrorMessages.UNAUTHORIZED,
        },
      };
    }

    if (!payload?.conversationId) {
      return {
        event: E.WebSocketEvents.CONVERSATION_JOIN_ERROR,
        data: {
          message: E.WebSocketErrorMessages.CONVERSATION_ID_REQUIRED,
        },
      };
    }
    await this.conversationsService.ensureConversationBelongsToUser(
      payload.conversationId,
      user.id,
    );
    client.join(this.getUserRoom(user.id));
    client.join(this.getConversationRoom(payload.conversationId));
    this.logger.log(
      E.WebSocketLogMessages.JOINED_CONVERSATION(
        client.id,
        user.id,
        payload.conversationId,
      ),
    );
    return {
      event: E.WebSocketEvents.CONVERSATION_JOINED,
      data: {
        conversationId: payload.conversationId,
      },
    };
  }

  emitUserMessageCreated(payload: T.TMessageCreatedPayload): void {
    this.emitToConversation(
      payload.conversationId,
      E.WebSocketEvents.MESSAGE_USER_CREATED,
      payload,
    );
  }

  emitAssistantMessageCreated(payload: T.TMessageCreatedPayload): void {
    this.emitToConversation(
      payload.conversationId,
      E.WebSocketEvents.MESSAGE_ASSISTANT_CREATED,
      payload,
    );
  }

  emitMessageError(payload: T.TMessageErrorPayload): void {
    this.emitToConversation(
      payload.conversationId,
      E.WebSocketEvents.MESSAGE_ERROR,
      payload,
    );
  }

  private emitToConversation<TPayload>(
    conversationId: string,
    eventName: string,
    payload: TPayload,
  ): void {
    if (!this.server) {
      this.logger.warn(E.WebSocketErrorMessages.SERVER_NOT_INITIALIZED);
      return;
    }
    this.server
      .to(this.getConversationRoom(conversationId))
      .emit(eventName, payload);
  }

  private getUserRoom(userId: string): string {
    return `user:${userId}`;
  }

  private getConversationRoom(conversationId: string): string {
    return `conversation:${conversationId}`;
  }
}
