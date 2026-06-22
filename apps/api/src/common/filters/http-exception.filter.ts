import { ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { Request, Response } from "express";

import * as T from "@ctypes/common.type";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = this.getStatusCode(exception);
    const errorName = this.getErrorName(exception, statusCode);
    const message = this.getErrorMessage(exception);
    const responseBody: T.TErrorResponseBody = {
      success: false,
      statusCode,
      error: errorName,
      message,
      timestamp: new Date().toISOString(),
      path: request.originalUrl || request.url,
      method: request.method,
    };
    this.logException(exception, request, responseBody);
    response.status(statusCode).json(responseBody);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) return exception.getStatus();
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorName(exception: unknown, statusCode: number): string {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null &&
        "error" in exceptionResponse
      ) {
        const error = (exceptionResponse as T.TValidationErrorResponse).error;
        if (typeof error === "string") return error;
      }
      return exception.name;
    }
    if (exception instanceof Error) return exception.name;
    return HttpStatus[statusCode] ?? "InternalServerError";
  }

  private getErrorMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === "string") return exceptionResponse;
      if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null &&
        "message" in exceptionResponse
      ) {
        const message = (exceptionResponse as T.TValidationErrorResponse)
          .message;
        if (Array.isArray(message) || typeof message === "string")
          return message;
      }
      return exception.message;
    }
    if (exception instanceof Error) return "Internal server error.";
    return "Internal server error.";
  }

  private logException(
    exception: unknown,
    request: Request,
    responseBody: T.TErrorResponseBody,
  ): void {
    const logContext = `${request.method} ${request.originalUrl || request.url}`;
    if (responseBody.statusCode >= 500) {
      this.logger.error(
        `${logContext} ${responseBody.statusCode} - ${JSON.stringify(
          responseBody.message,
        )}`,
        exception instanceof Error ? exception.stack : undefined,
      );
      return;
    }
    this.logger.warn(
      `${logContext} ${responseBody.statusCode} - ${JSON.stringify(
        responseBody.message,
      )}`,
    );
  }
}
