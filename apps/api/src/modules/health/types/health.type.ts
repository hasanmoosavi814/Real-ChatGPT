export type TDependencyStatus = {
  error?: string;
  latencyMs?: number;
  status: "up" | "down";
};

export type THealthResponse = {
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  status: "ok" | "degraded" | "error";
  dependencies?: {
    cache?: TDependencyStatus;
    database?: TDependencyStatus;
    aiService?: TDependencyStatus;
  };
};
