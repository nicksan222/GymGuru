import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const getNextWorkoutExercise = protectedProcedure
  .input(
    z.object({
      workoutId: z.string(),
      exerciseId: z.string(),
      setId: z.string(),
      reps: z.number(),
      weight: z.number(),
      rest: z.number(),
    }),
  )
  .query(async ({ ctx, input }) => {
    // What is the last recorded set?
    const lastRecordedSet = await ctx.prisma.workoutRecordSet.findFirst({
      where: {
        workoutRecordId: input.workoutId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastRecordedSet) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workout not found",
      });
    }

    // Get the next exercise
  });

export default getNextWorkoutExercise;
