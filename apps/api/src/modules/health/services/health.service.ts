import { TDependencyStatus, THealthResponse } from "@health/types/health.type";
import { firstValueFrom, timeout } from "rxjs";
import { Injectable, HttpStatus } from "@nestjs/common";
import { HealthErrorMessages } from "@health/enums/health-message.enum";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { CacheService } from "@cache/services/cache.service";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getFullHealth(): Promise<THealthResponse> {
    const [database, cache, aiService] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
      this.checkAiService(),
    ]);
    const dependencies = { database, cache, aiService };
    const allUp = Object.values(dependencies).every((d) => d.status === "up");
    return this.buildResponse(allUp ? "ok" : "degraded", dependencies);
  }

  async getReadiness(): Promise<THealthResponse> {
    const [database, cache] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
    ]);
    const dependencies = { database, cache };
    const allUp = Object.values(dependencies).every((d) => d.status === "up");
    return this.buildResponse(allUp ? "ok" : "error", dependencies);
  }

  live(): THealthResponse {
    return this.buildResponse("ok");
  }

  private async checkDatabase(): Promise<TDependencyStatus> {
    const startedAt = Date.now();
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return {
        status: "up",
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      return this.toDownStatus(error, startedAt);
    }
  }

  private async checkCache(): Promise<TDependencyStatus> {
    const startedAt = Date.now();
    try {
      await this.cacheService.ping();
      return {
        status: "up",
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      return this.toDownStatus(error, startedAt);
    }
  }

  private async checkAiService(): Promise<TDependencyStatus> {
    const startedAt = Date.now();
    const aiServiceUrl = this.configService
      .get<string>("AI_SERVICE_URL")
      ?.replace(/\/$/, "");
    if (!aiServiceUrl)
      return {
        status: "down",
        error: HealthErrorMessages.AI_SERVICE_URL_NOT_DEFINED,
      };
    try {
      await firstValueFrom(
        this.httpService
          .get(`${aiServiceUrl}/health`, {
            validateStatus: (status) =>
              status < HttpStatus.INTERNAL_SERVER_ERROR,
          })
          .pipe(timeout(3000)),
      );
      return {
        status: "up",
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      return this.toDownStatus(error, startedAt);
    }
  }

  private buildResponse(
    status: "ok" | "degraded" | "error",
    dependencies?: Record<string, TDependencyStatus>,
  ): THealthResponse {
    return {
      status,
      service: "chat-api",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      ...(dependencies ? { dependencies } : {}),
    };
  }

  private toDownStatus(error: unknown, startedAt: number): TDependencyStatus {
    return {
      status: "down",
      latencyMs: Date.now() - startedAt,
      error: this.getErrorMessage(error),
    };
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return HealthErrorMessages.UNKNOWN_ERROR;
  }
}
