import { protectedProcedure } from "../../trpc";
import { createPaymentInput } from "./types";

const createPayment = protectedProcedure
  .input(createPaymentInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.auth.userId) {
      throw new Error("Not logged in");
    }

    return ctx.prisma.payment.create({
      data: {
        ...input,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default createPayment;
