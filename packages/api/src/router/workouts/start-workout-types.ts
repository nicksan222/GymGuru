import { TRPCError } from "@trpc/server";

export const conflictError = new TRPCError({
  code: "CONFLICT",
  message: "A workout is already running",
});

export const notFoundError = new TRPCError({
  code: "NOT_FOUND",
  message: "Workout not found for this user",
});
