import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const deleteExercise = protectedProcedure
  .input(
    z.object({
      workoutExerciseId: z.string().uuid(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.workoutExercise.deleteMany({
      where: {
        AND: [{ id: input.workoutExerciseId }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default deleteExercise;
