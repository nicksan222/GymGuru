import { MuscleTarget } from "@acme/db";
import { protectedProcedure } from "../../trpc";
import { createExerciseInput } from "./types";

const createExercise = protectedProcedure
  .input(createExerciseInput)
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.create({
      data: {
        ...input,
        imageUrl: (input.imageUrl || []).join(","),
        trainerId: ctx.auth.userId,
        secondaryMuscles: (input.secondaryMuscles || []).join(","),
        primaryMuscle: input.primaryMuscle as MuscleTarget,
      },
    });
  });

export default createExercise;
