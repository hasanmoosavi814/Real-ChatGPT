import { HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { Body, Controller, Get, HttpCode } from "@nestjs/common";
import { JwtAuthGuard } from "@auth/jwt/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { AuthService } from "@auth/services/auth.service";
import { RegisterDto } from "@auth/dtos/register.dto";
import { TAuthUser } from "@auth/types/decorator.type";
import { Response } from "express";
import { LoginDto } from "@auth/dtos/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(dto, response);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(dto, response);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: TAuthUser) {
    return user;
  }
}
