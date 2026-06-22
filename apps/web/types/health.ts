export type DependencyStatus = {
  error?: string;
  latencyMs?: number;
  status: "up" | "down";
};

export type HealthResponse = {
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  status: "ok" | "degraded" | "error";
  dependencies?: Record<string, DependencyStatus>;
};

export type AiServiceHealthResponse = {
  status: "ok";
  timestamp: string;
  service: "ai-service";
  uptimeSeconds: number;
};
