import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const deleteExercise = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.deleteMany({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default deleteExercise;
