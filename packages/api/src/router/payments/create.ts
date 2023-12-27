import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const createPayment = protectedProcedure
  .input(
    z.object({
      amount: z.number(),
      planId: z.string(),
      clientId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a payment",
      });
    }

    return await ctx.prisma.payment.create({
      data: {
        trainerId: ctx.auth.userId,
        Client: {
          connect: {
            id: input.clientId,
          },
        },
        amount: input.amount,
        WorkoutPlan: {
          connect: {
            id: input.planId,
          },
        },
      },
    });
  });

export default createPayment;
