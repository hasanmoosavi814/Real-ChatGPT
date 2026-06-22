import { PassportModule } from "@nestjs/passport";
import { AuthController } from "@auth/controllers/auth.controller";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "@auth/services/auth.service";
import { UsersModule } from "@users/users.module";
import { JwtStrategy } from "@auth/jwt/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>("JWT_SECRET");
        if (!jwtSecret) throw new Error("JWT_SECRET is not defined.");
        return {
          secret: jwtSecret,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
