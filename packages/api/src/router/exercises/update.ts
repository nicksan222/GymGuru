import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const updateExercise = protectedProcedure
  .input(
    z.object({
      exerciseId: z.string(),
      name: z.string(),
      description: z.string(),
      primaryMuscles: z.string(),
      secondaryMuscles: z.string().optional(),
      videoUrl: z.string().optional(),
      imageUrl: z.string().optional(),
      category: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.updateMany({
      where: {
        AND: [{ id: input.exerciseId }, { trainerId: ctx.auth.userId }],
      },
      data: {
        ...input,
      },
    });
  });

export default updateExercise;
