import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@app/app.module";

const cookieParser = require("cookie-parser");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const webOrigin =
    configService.get<string>("WEB_ORIGIN") ?? "http://localhost:3000";
  const apiPort = Number(configService.get<string>("API_PORT") ?? 4000);
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: webOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(apiPort);
  console.log(`API server is running on http://localhost:${apiPort}/api`);
}

bootstrap();
