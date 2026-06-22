export enum CacheErrorMessages {
  INVALID_JSON_CACHE = "Invalid cached JSON for key",
  REDIS_CONNECT_FAILED = "Failed to connect to Redis cache.",
  REDIS_DISCONNECT_FAILED = "Failed to disconnect Redis cache.",
}

export enum CacheConfigDefaults {
  REDIS_URL = "redis://localhost:6379",
  DEFAULT_TTL_SECONDS = 60,
}

export const CacheLogMessages = {
  connected: "Redis cache connected.",
  disconnected: "Redis cache disconnected.",
  cacheHit: (key: string) => `Cache hit: ${key}`,
  cacheMiss: (key: string) => `Cache miss: ${key}`,
  cacheSet: (key: string, ttl: number) => `Cache set: ${key}, ttl=${ttl}s`,
  cacheDeleted: (key: string) => `Cache deleted: ${key}`,
  cacheDeletedMany: (keys: string[]) =>
    `Cache deleted many: ${keys.join(", ")}`,
  cacheDeletedPattern: (pattern: string) =>
    `Cache deleted by pattern: ${pattern}`,
};
