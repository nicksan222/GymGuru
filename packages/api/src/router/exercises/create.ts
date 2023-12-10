import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { createExerciseInput } from "./types";

const createExercise = protectedProcedure
  .input(createExerciseInput)
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.create({
      data: {
        ...input,
        imageUrl: (input.imageUrl || []).join(","),
        trainerId: ctx.auth.userId,
        primaryMuscle: (input.primaryMuscle || []).join(","),
        secondaryMuscles: (input.secondaryMuscles || []).join(","),
      },
    });
  });

export default createExercise;
