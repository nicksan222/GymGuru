import { protectedProcedure } from "../../trpc";
import { updateExerciseInput } from "./types";
import { MuscleTarget } from "@acme/db";

const updateExercise = protectedProcedure
  .input(updateExerciseInput)
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
