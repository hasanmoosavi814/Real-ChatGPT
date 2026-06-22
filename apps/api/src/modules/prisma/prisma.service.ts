import { Injectable, OnModuleInit } from "@nestjs/common";
import { Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: Pool;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>("DATABASE_URL");
    if (!databaseUrl) throw new Error("DATABASE_URL is not defined.");
    const pool = new Pool({
      connectionString: databaseUrl,
    });
    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["warn", "error"],
    });
    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log("Prisma connected to the database.");
    } catch (error) {
      this.logger.error("Failed to connect Prisma to the database.", error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      await this.pool.end();
      this.logger.log("Prisma disconnected from the database.");
    } catch (error) {
      this.logger.error(
        "Failed to disconnect Prisma from the database.",
        error,
      );
      throw error;
    }
  }
}
