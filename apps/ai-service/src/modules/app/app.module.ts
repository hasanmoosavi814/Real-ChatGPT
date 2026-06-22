import { GenerateModule } from "@generate/generate.module";
import { HealthModule } from "@health/health.module";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
    HealthModule,
    GenerateModule,
  ],
})
export class AppModule {}
