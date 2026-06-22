import { ConflictException, Injectable } from "@nestjs/common";
import { JwtExpiresIn, TPublicUser } from "@auth/types/auth-service.type";
import { UnauthorizedException } from "@nestjs/common";
import { AuthConfigMessages } from "@auth/enums/auth-message.enum";
import { AuthErrorMessages } from "@auth/enums/auth-message.enum";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "@users/services/user.service";
import { RegisterDto } from "@auth/dtos/register.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "@ctypes/jwt.type";
import { Response } from "express";
import { LoginDto } from "@auth/dtos/login.dto";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, response: Response): Promise<TPublicUser> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    if (existingUser)
      throw new ConflictException(AuthErrorMessages.USER_ALREADY_EXISTS);
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const user = await this.usersService.create({
      email: normalizedEmail,
      passwordHash,
      name: dto.name?.trim() || null,
    });
    await this.setAuthCookie(response, {
      sub: user.id,
      email: user.email,
    });
    return this.toPublicUser(user);
  }

  async login(dto: LoginDto, response: Response): Promise<TPublicUser> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user)
      throw new UnauthorizedException(AuthErrorMessages.INVALID_CREDENTIALS);
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException(AuthErrorMessages.INVALID_CREDENTIALS);
    await this.setAuthCookie(response, {
      sub: user.id,
      email: user.email,
    });
    return this.toPublicUser(user);
  }

  logout(response: Response): { success: true } {
    const cookieName =
      this.configService.get<string>("COOKIE_NAME") ??
      AuthConfigMessages.DEFAULT_COOKIE_NAME;
    response.clearCookie(cookieName, {
      httpOnly: true,
      secure: this.isProduction(),
      sameSite: "lax",
      path: "/",
    });
    return { success: true };
  }

  private getJwtExpiresIn(): JwtExpiresIn {
    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN") ?? "1d";
    const allowedValues: JwtExpiresIn[] = ["15m", "1h", "12h", "1d", "7d"];
    if (allowedValues.includes(expiresIn as JwtExpiresIn))
      return expiresIn as JwtExpiresIn;
    return "1d";
  }

  private async setAuthCookie(
    response: Response,
    payload: JwtPayload,
  ): Promise<void> {
    const cookieName =
      this.configService.get<string>("COOKIE_NAME") ??
      AuthConfigMessages.DEFAULT_COOKIE_NAME;
    const expiresIn = this.getJwtExpiresIn();
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });
    response.cookie(cookieName, token, {
      httpOnly: true,
      secure: this.isProduction(),
      sameSite: "lax",
      path: "/",
      maxAge: this.getCookieMaxAgeMs(expiresIn),
    });
  }

  private getCookieMaxAgeMs(expiresIn: string): number {
    if (expiresIn.endsWith("d")) {
      const days = Number(expiresIn.replace("d", ""));
      return days * 24 * 60 * 60 * 1000;
    }
    if (expiresIn.endsWith("h")) {
      const hours = Number(expiresIn.replace("h", ""));
      return hours * 60 * 60 * 1000;
    }
    return 24 * 60 * 60 * 1000;
  }

  private isProduction(): boolean {
    return this.configService.get<string>("NODE_ENV") === "production";
  }

  private toPublicUser(user: {
    id: string;
    email: string;
    createdAt: Date;
    name: string | null;
  }): TPublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
