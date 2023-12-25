import { protectedProcedure } from "../../trpc";
import { listExercisesInput } from "./types";
import { MuscleTarget } from "@acme/db";

const listExercises = protectedProcedure
  .input(listExercisesInput)
  .query(async ({ ctx, input }) => {
    // Check if the muscle group is valid, if provided
    if (
      input.muscleGroup &&
      !Object.values(MuscleTarget).includes(input.muscleGroup as MuscleTarget)
    ) {
      throw new Error("Invalid muscle group");
    }

    if (input.muscleGroup) {
      // Query filtering by muscle group
      return ctx.prisma.exercise.findMany({
        where: {
          OR: [
            { primaryMuscle: input.muscleGroup as MuscleTarget },
            {
              secondaryMuscles: { contains: input.muscleGroup as MuscleTarget },
            },
          ],
          trainerId: ctx.auth.userId,
        },
        select: {
          id: true,
          name: true,
          primaryMuscle: true,
          secondaryMuscles: true,
          imageUrl: true,
          category: true,
        },
      });
    } else if (input.filterIds) {
      // Query filtering by ids
      return ctx.prisma.exercise.findMany({
        where: {
          id: { in: input.filterIds },
          trainerId: ctx.auth.userId,
        },
      });
    } else {
      // Query for all exercises for the trainerId when no muscle group is provided
      return ctx.prisma.exercise.findMany({
        where: {
          trainerId: ctx.auth.userId,
        },
        select: {
          id: true,
          name: true,
          primaryMuscle: true,
          secondaryMuscles: true,
          imageUrl: true,
          category: true,
        },
      });
    }
  });

export default listExercises;
