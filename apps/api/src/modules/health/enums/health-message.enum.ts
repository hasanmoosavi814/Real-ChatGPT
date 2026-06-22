export enum HealthErrorMessages {
  UNKNOWN_ERROR = "Unknown error.",
  AI_SERVICE_URL_NOT_DEFINED = "AI_SERVICE_URL is not defined.",
}

export const HealthLogMessages = {
  dbUp: "Database is healthy.",
  cacheUp: "Cache is healthy.",
  aiUp: "AI service is healthy.",
  dbCheckStart: "Checking database health...",
  cacheCheckStart: "Checking cache health...",
  aiCheckStart: "Checking AI service health...",
};
