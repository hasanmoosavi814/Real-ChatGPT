import { Controller, Get } from "@nestjs/common";
import { THealthResponse } from "@health/type/health.type";

@Controller("health")
export class HealthController {
  @Get()
  health(): THealthResponse {
    return {
      status: "ok",
      service: "ai-service",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
