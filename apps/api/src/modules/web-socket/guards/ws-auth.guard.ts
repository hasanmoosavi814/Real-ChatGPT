import { CanActivate, Injectable, Logger } from "@nestjs/common";
import { TAuthenticatedSocket } from "@web-socket/types/web-socket.type";
import { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "@users/services/user.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "@ctypes/jwt.type";
import { Socket } from "socket.io";

@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<TAuthenticatedSocket>();
    const token = this.extractTokenFromSocket(client);
    if (!token) {
      this.logger.warn("WebSocket connection rejected: missing auth cookie.");
      client.emit("auth:error", {
        message: "Authentication cookie is missing.",
      });
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        this.logger.warn(
          `WebSocket connection rejected: user not found. userId=${payload.sub}`,
        );
        client.emit("auth:error", {
          message: "User no longer exists.",
        });
        return false;
      }
      client.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      return true;
    } catch (error) {
      this.logger.warn("WebSocket connection rejected: invalid token.");
      client.emit("auth:error", {
        message: "Invalid or expired authentication token.",
      });
      return false;
    }
  }

  private extractTokenFromSocket(client: Socket): string | null {
    const cookieName =
      this.configService.get<string>("COOKIE_NAME") ?? "access_token";
    const rawCookieHeader = client.handshake.headers.cookie;
    if (!rawCookieHeader) return null;
    const cookies = this.parseCookieHeader(rawCookieHeader);
    return cookies[cookieName] ?? null;
  }

  private parseCookieHeader(cookieHeader: string): Record<string, string> {
    return cookieHeader
      .split(";")
      .reduce<Record<string, string>>((cookies, cookiePart) => {
        const [rawKey, ...rawValueParts] = cookiePart.trim().split("=");
        if (!rawKey) return cookies;
        cookies[rawKey] = decodeURIComponent(rawValueParts.join("="));
        return cookies;
      }, {});
  }
}
