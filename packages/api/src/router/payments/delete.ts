import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const deletePayment = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return await ctx.prisma.payment.deleteMany({
      where: {
        id: input.id,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default deletePayment;
