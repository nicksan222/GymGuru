import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const deleteExercise = protectedProcedure
  .input(
    z.object({
      planId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.workoutPlan.deleteMany({
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

export default deleteExercise;
