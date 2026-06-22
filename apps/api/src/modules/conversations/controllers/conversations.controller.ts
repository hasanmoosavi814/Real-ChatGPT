import { Body, Controller, Delete, Get } from "@nestjs/common";
import { HttpCode, HttpStatus, Param } from "@nestjs/common";
import { Patch, Post, UseGuards } from "@nestjs/common";
import { UpdateConversationDto } from "@conversations/dtos/update-conversations.dto";
import { CreateConversationDto } from "@conversations/dtos/create-conversations.dto";
import { ConversationsService } from "@conversations/services/conversations.service";
import { JwtAuthGuard } from "@auth/jwt/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { TAuthUser } from "@auth/types/decorator.type";

@Controller("conversations")
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@CurrentUser() user: TAuthUser, @Body() dto: CreateConversationDto) {
    return this.conversationsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: TAuthUser) {
    return this.conversationsService.findAllForUser(user.id);
  }

  @Get(":conversationId")
  findOne(
    @CurrentUser() user: TAuthUser,
    @Param("conversationId") conversationId: string,
  ) {
    return this.conversationsService.findOneForUser(conversationId, user.id);
  }

  @Patch(":conversationId")
  updateTitle(
    @CurrentUser() user: TAuthUser,
    @Param("conversationId") conversationId: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.conversationsService.updateTitleForUser(
      conversationId,
      user.id,
      dto,
    );
  }

  @Delete(":conversationId")
  @HttpCode(HttpStatus.OK)
  delete(
    @CurrentUser() user: TAuthUser,
    @Param("conversationId") conversationId: string,
  ) {
    return this.conversationsService.deleteForUser(conversationId, user.id);
  }
}
