import { Request } from "express";

export type TValidationErrorResponse = {
  error?: string;
  statusCode?: number;
  message?: string | string[];
};

export type TErrorResponseBody = {
  path: string;
  error: string;
  success: false;
  method: string;
  timestamp: string;
  statusCode: number;
  message: string | string[];
};

export type TRequestWithUser = Request & {
  user?: {
    id?: string;
    email?: string;
  };
};
