import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const listPayments = protectedProcedure
  .input(
    z.object({
      clientId: z.string().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.payment.findMany({
      where: {
        trainerId: ctx.auth.userId,
        clientId: input.clientId,
      },
    });
  });

export default listPayments;
