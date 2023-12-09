import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const deleteExercise = protectedProcedure
  .input(
    z.object({
      exerciseId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.deleteMany({
      where: {
        AND: [{ id: input.exerciseId }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default deleteExercise;
