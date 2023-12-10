import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { listExercisesInput } from "./types";

const listExercises = protectedProcedure
  .input(listExercisesInput)
  .query(async ({ ctx, input }) => {
    return ctx.prisma.exercise.findMany({
      where: {
        OR: [
          {
            primaryMuscle: {
              contains: input.muscleGroup,
            },
          },
          {
            secondaryMuscles: {
              contains: input.muscleGroup,
            },
          },
        ],
        AND: [
          {
            trainerId: ctx.auth.userId,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        primaryMuscle: true,
        secondaryMuscles: true,
      },
    });
  });

export default listExercises;
