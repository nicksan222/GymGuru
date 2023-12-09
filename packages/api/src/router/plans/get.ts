import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const getPlan = protectedProcedure
  .input(
    z.object({
      planId: z.string().uuid(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.workoutPlan.findFirst({
      where: {
        AND: [
          {
            id: input.planId,
          },
          {
            trainerId: ctx.auth.userId,
          },
        ],
      },
    });
  });

export default getPlan;
