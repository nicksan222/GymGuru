import { protectedProcedure } from "../../trpc";
import * as z from "zod";
import { MuscleTarget } from "@acme/db";

const updateExercise = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      primaryMuscle: z.string().optional(),
      secondaryMuscles: z.string().optional(),
      videoUrl: z.string().optional(),
      imageUrl: z.array(z.string()).optional(),
      category: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.updateMany({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
      data: {
        trainerId: ctx.auth.userId,
        id: input.id,
        category: input.category,
        name: input.name,
        description: input.description,
        videoUrl: input.videoUrl,
        secondaryMuscles: input.secondaryMuscles,
        imageUrl: (input.imageUrl || []).join(","),
        primaryMuscle: input.primaryMuscle as MuscleTarget,
      },
    });
  });

export default updateExercise;
