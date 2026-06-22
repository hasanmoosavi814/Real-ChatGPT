import { HealthController } from "@health/controllers/health.controller";
import { AppCacheModule } from "@cache/cache.module";
import { HealthService } from "@health/services/health.service";
import { PrismaModule } from "@prisma/prisma.module";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, AppCacheModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
