import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const updatePlan = protectedProcedure
  .input(
    z.object({
      planId: z.string().uuid(),
      name: z.string().optional(),
      description: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { planId, ...updateData } = input;

    return ctx.prisma.workoutPlan.updateMany({
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
      data: updateData,
    });
  });

export default updatePlan;
