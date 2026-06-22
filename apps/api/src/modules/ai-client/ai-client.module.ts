import { AiClientService } from "@ai-client/services/ai-client.service";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
  imports: [HttpModule],
  providers: [AiClientService],
  exports: [AiClientService],
})
export class AiClientModule {}
