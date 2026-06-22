import { Injectable, OnModuleInit } from "@nestjs/common";
import { OnModuleDestroy, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Redis from "ioredis";

import * as E from "@cache/enums/cache-message.enum";

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly redisService: Redis;
  private readonly defaultTtlSeconds: number;

  constructor(private readonly configService: ConfigService) {
    const redisUrl =
      this.configService.get<string>("REDIS_URL") ??
      E.CacheConfigDefaults.REDIS_URL;
    this.defaultTtlSeconds =
      this.configService.get<number>("CACHE_DEFAULT_TTL_SECONDS") ??
      E.CacheConfigDefaults.DEFAULT_TTL_SECONDS;
    this.redisService = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.redisService.connect();
      this.logger.log(E.CacheLogMessages.connected);
    } catch (error) {
      this.logger.error(E.CacheErrorMessages.REDIS_CONNECT_FAILED, error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.redisService.quit();
      this.logger.log(E.CacheLogMessages.disconnected);
    } catch (error) {
      this.logger.error(E.CacheErrorMessages.REDIS_DISCONNECT_FAILED, error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const cachedValue = await this.redisService.get(key);
    if (!cachedValue) {
      this.logger.debug(E.CacheLogMessages.cacheMiss(key));
      return null;
    }
    this.logger.debug(E.CacheLogMessages.cacheHit(key));
    try {
      return JSON.parse(cachedValue) as T;
    } catch (error) {
      this.logger.warn(`${E.CacheErrorMessages.INVALID_JSON_CACHE}: ${key}`);
      await this.delete(key);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds = this.defaultTtlSeconds,
  ): Promise<void> {
    await this.redisService.set(key, JSON.stringify(value), "EX", ttlSeconds);
    this.logger.debug(E.CacheLogMessages.cacheSet(key, ttlSeconds));
  }

  async delete(key: string): Promise<void> {
    await this.redisService.del(key);
    this.logger.debug(E.CacheLogMessages.cacheDeleted(key));
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await this.redisService.del(...keys);
    this.logger.debug(E.CacheLogMessages.cacheDeletedMany(keys));
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const stream = this.redisService.scanStream({
      match: pattern,
      count: 100,
    });
    const keys: string[] = [];
    for await (const resultKeys of stream) {
      keys.push(...(resultKeys as string[]));
    }
    if (keys.length > 0) {
      await this.redisService.del(...keys);
      this.logger.debug(E.CacheLogMessages.cacheDeletedPattern(pattern));
    }
  }

  async ping(): Promise<string> {
    return this.redisService.ping();
  }
}
