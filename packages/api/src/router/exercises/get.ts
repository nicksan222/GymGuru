import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const getExercise = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.exercise.findFirst({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default getExercise;
