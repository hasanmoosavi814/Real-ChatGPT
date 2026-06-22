import { THealthResponse } from "@health/types/health.type";
import { Controller, Get } from "@nestjs/common";
import { HealthService } from "@health/services/health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async health(): Promise<THealthResponse> {
    return this.healthService.getFullHealth();
  }

  @Get("live")
  live(): THealthResponse {
    return this.healthService.live();
  }

  @Get("ready")
  async ready(): Promise<THealthResponse> {
    return this.healthService.getReadiness();
  }
}
