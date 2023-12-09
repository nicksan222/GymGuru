import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const getExercise = protectedProcedure
  .input(
    z.object({
      exerciseId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.exercise.findFirst({
      where: {
        AND: [{ id: input.exerciseId }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default getExercise;
