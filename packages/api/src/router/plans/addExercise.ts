import { protectedProcedure } from "../../trpc";
import { z } from "zod";

// Define the schema for each set in an exercise
const setSchema = z.object({
  setNumber: z.number(),
  reps: z.number(),
  rest: z.number(),
});

// Define the input schema for adding an exercise
const addExercise = protectedProcedure
  .input(
    z.object({
      planId: z.string().uuid(),
      exerciseId: z.string().uuid(),
      order: z.number(),
      exerciseSets: z.array(setSchema),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Create the WorkoutExercise
    const workoutExercise = await ctx.prisma.workoutExercise.create({
      data: {
        exerciseId: input.exerciseId,
        workoutPlanId: input.planId,
        order: input.order,
        trainerId: ctx.auth.userId,
      },
    });

    // Create ExerciseSets for each set in the exercise
    await Promise.all(
      input.exerciseSets.map((set) =>
        ctx.prisma.exerciseSet.create({
          data: {
            workoutExerciseId: workoutExercise.id,
            setNumber: set.setNumber,
            reps: set.reps,
            rest: set.rest,
          },
        }),
      ),
    );

    return workoutExercise;
  });

export default addExercise;
