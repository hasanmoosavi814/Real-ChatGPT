import { GenerateController } from "@generate/controllers/generate.controller";
import { GenerateService } from "@generate/services/generate.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [GenerateController],
  providers: [GenerateService],
  exports: [GenerateService],
})
export class GenerateModule {}
