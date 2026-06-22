import { AiMessageRole } from "@generate/enum/generate.enum";
import { Type } from "class-transformer";

import * as CV from "class-validator";

export class GenerateMessageDto {
  @CV.IsEnum(AiMessageRole) role!: AiMessageRole;
  @CV.IsString() @CV.MinLength(1) @CV.MaxLength(4000) content!: string;
}

export class GenerateResponseDto {
  @CV.IsUUID() conversationId!: string;
  @CV.IsOptional() @CV.IsString() @CV.MaxLength(100) model?: string;
  @CV.IsArray()
  @CV.ArrayMaxSize(30)
  @CV.ValidateNested({ each: true })
  @Type(() => GenerateMessageDto)
  messages!: GenerateMessageDto[];
}
