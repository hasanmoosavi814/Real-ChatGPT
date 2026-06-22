export type ApiErrorResponse = {
  path: string;
  error: string;
  success: false;
  method: string;
  timestamp: string;
  statusCode: number;
  message: string | string[];
};
