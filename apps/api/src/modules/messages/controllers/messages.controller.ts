import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MessagesService } from "@messages/services/messages.service";
import { SendMessageDto } from "@messages/dtos/send.messages.dto";
import { JwtAuthGuard } from "@auth/jwt/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { TAuthUser } from "@auth/types/decorator.type";

@Controller("conversations/:conversationId/messages")
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findHistory(
    @CurrentUser() user: TAuthUser,
    @Param("conversationId") conversationId: string,
  ) {
    return this.messagesService.findHistoryForUser({
      conversationId,
      userId: user.id,
    });
  }

  @Post()
  sendMessage(
    @CurrentUser() user: TAuthUser,
    @Param("conversationId") conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage({
      conversationId,
      userId: user.id,
      dto,
    });
  }
}
