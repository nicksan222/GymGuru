import { protectedProcedure } from "../../trpc";
import { deletePaymentInput } from "./types";

const deletePayment = protectedProcedure
  .input(deletePaymentInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.auth.userId) {
      throw new Error("Not logged in");
    }

    return ctx.prisma.payment.deleteMany({
      where: {
        id: input.id,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default deletePayment;
