import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ApiErrorResponse } from "@/types/api";
import type { SerializedError } from "@reduxjs/toolkit";

export const getApiErrorMessage = (
  error: FetchBaseQueryError | SerializedError | unknown,
): string => {
  if (!error) return "Something went wrong.";
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as FetchBaseQueryError).data as
      | ApiErrorResponse
      | undefined;
    if (data?.message) {
      return Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message;
    }
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as SerializedError).message;
    if (message) return message;
  }
  return "Something went wrong.";
};
