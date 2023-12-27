import { router } from "../../trpc";
import createPayment from "./create";
import deletePayment from "./delete";
import listPayments from "./list";

export const paymentsRouter = router({
  createPayment,
  listPayments,
  deletePayment,
});
