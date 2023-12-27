import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../../trpc";
import createPayment from "./create";
import deletePayment from "./delete";
import listPayments from "./list";

export const paymentsRouter = router({
  createPayment,
  listPayments,
  deletePayment,
});

export type PaymentsRouterInput = inferRouterInputs<typeof paymentsRouter>;
export type PaymentsRouterOutput = inferRouterOutputs<typeof paymentsRouter>;
