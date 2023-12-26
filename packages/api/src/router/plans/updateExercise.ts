import { protectedProcedure } from "../../trpc";
import { z } from "zod";

// Define the schema for updating each set in an exercise
const setUpdateSchema = z.object({
  id: z.string().uuid(),
  setNumber: z.number(),
  reps: z.number(),
  rest: z.number(),
});

// Define the input schema for updating an exercise
const updateExercise = protectedProcedure
  .input(
    z.object({
      workoutExerciseId: z.string().uuid(),
      order: z.number().optional(),
      exerciseSets: z.array(setUpdateSchema).optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Update the WorkoutExercise
    const workoutExercise = await ctx.prisma.workoutExercise.update({
      where: { id: input.workoutExerciseId },
      data: {
        order: input.order,
      },
    });

    // Update ExerciseSets if provided
    if (input.exerciseSets) {
      await Promise.all(
        input.exerciseSets.map((set) =>
          ctx.prisma.workoutSet.update({
            where: { id: set.id },
            data: {
              setNumber: set.setNumber,
              reps: set.reps,
              rest: set.rest,
            },
          }),
        ),
      );
    }

    return workoutExercise;
  });

export default updateExercise;
