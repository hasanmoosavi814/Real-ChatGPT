import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common";
import { Logger, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { TRequestWithUser } from "@ctypes/common.type";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<TRequestWithUser>();
    const response = httpContext.getResponse<Response>();
    const startedAt = Date.now();
    const method = request.method;
    const url = request.originalUrl || request.url;
    const ip = this.getClientIp(request);
    const userAgent = request.headers["user-agent"] ?? "unknown";
    const userId = request.user?.id ?? "anonymous";

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt;
          const statusCode = response.statusCode;

          this.logger.log(
            `${method} ${url} ${statusCode} ${durationMs}ms userId=${userId} ip=${ip} ua="${userAgent}"`,
          );
        },
        error: () => {
          const durationMs = Date.now() - startedAt;
          const statusCode = response.statusCode;

          this.logger.warn(
            `${method} ${url} ${statusCode} ${durationMs}ms userId=${userId} ip=${ip} ua="${userAgent}" failed=true`,
          );
        },
      }),
    );
  }

  private getClientIp(request: Request): string {
    const forwardedFor = request.headers["x-forwarded-for"];
    if (typeof forwardedFor === "string")
      return forwardedFor.split(",")[0]?.trim() || request.ip || "unknown";
    if (Array.isArray(forwardedFor) && forwardedFor.length > 0)
      return forwardedFor[0];
    return request.ip || "unknown";
  }
}
