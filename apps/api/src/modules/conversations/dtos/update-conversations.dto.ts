import { IsString, MaxLength } from "class-validator";

export class UpdateConversationDto {
  @IsString()
  @MaxLength(120)
  title!: string;
}
