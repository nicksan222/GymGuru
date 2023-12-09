import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const createExercise = protectedProcedure
  .input(
    z.object({
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
    return ctx.prisma.exercise.create({
      data: {
        ...input,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default createExercise;
