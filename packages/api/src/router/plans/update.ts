import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const updatePlan = protectedProcedure
  .input(
    z.object({
      planId: z.string(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { planId, ...updateData } = input;
    const previousPlan = await ctx.prisma.workoutPlan.findFirst({
      where: {
        AND: [
          {
            id: planId,
          },
          {
            trainerId: ctx.auth.userId,
          },
        ],
      },
    });

    if (!previousPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Plan not found",
      });
    }

    return ctx.prisma.workoutPlan.update({
      where: {
        id: planId,
      },
      data: {
        endDate: updateData.endDate || previousPlan.endDate,
        startDate: updateData.startDate || previousPlan.startDate,
      },
    });
  });

export default updatePlan;
