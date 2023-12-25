import { protectedProcedure } from "../../trpc";
import { listPaymentsInput } from "./types";

const listPayments = protectedProcedure
  .input(listPaymentsInput)
  .query(async ({ ctx, input }) => {
    return ctx.prisma.payment.findMany({
      where: {
        trainerId: ctx.auth.userId,
        clientId: input.clientId,
      },
    });
  });

export default listPayments;
