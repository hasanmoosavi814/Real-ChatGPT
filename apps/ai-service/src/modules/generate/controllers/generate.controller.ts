import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { TGenerateResponseResult } from "@generate/types/generate.type";
import { GenerateResponseDto } from "@generate/dtos/generate-response.dto";
import { GenerateService } from "@generate/services/generate.service";

@Controller("generate")
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  generate(@Body() dto: GenerateResponseDto): TGenerateResponseResult {
    return this.generateService.generate(dto);
  }
}
