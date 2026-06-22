import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "@users/services/user.service";
import { JwtPayload } from "@ctypes/jwt.type";
import { TAuthUser } from "@auth/types/decorator.type";
import { Request } from "express";

const cookieExtractor = (request: Request): string | null => {
  if (!request?.cookies) return null;
  const cookieName = process.env.COOKIE_NAME ?? "access_token";
  return request.cookies[cookieName] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>("JWT_SECRET");
    if (!jwtSecret) throw new Error("JWT_SECRET is not defined.");
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<TAuthUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException("User no longer exists.");
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
