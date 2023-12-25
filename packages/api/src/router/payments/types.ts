import * as z from "zod";

export const createPaymentInput = z.object({
  amount: z.number(),
  planId: z.string(),
  clientId: z.string(),
});

export const listPaymentsInput = z.object({
  clientId: z.string().optional(),
});

export const deletePaymentInput = z.object({
  id: z.string(),
});
