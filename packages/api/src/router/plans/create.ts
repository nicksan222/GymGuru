import { Context } from "../../context";
import { protectedProcedure } from "../../trpc";
import { createPlanInput } from "./types";
import * as z from "zod";

// Function to create workout exercises
async function createWorkoutExercises(
  input: z.infer<typeof createPlanInput>,
  workoutPlanId: string,
  ctx: Context,
) {
  const exercises = input.workouts?.map((workout) => workout.exercises).flat();
  if (!exercises) return;

  // Create each exercise and its associated sets
  await Promise.all(
    exercises.map(async (exercise) => {
      if (!exercise) return;
      if (!exercise.order) throw new Error("Exercise order is required");
      if (!ctx.auth.userId) throw new Error("User ID is required");

      const workoutExerciseId = await ctx.prisma.workoutExercise.create({
        data: {
          order: exercise.order,
          trainerId: ctx.auth.userId,
          workoutPlanDayId: workoutPlanId,
          description: exercise.description,
          exerciseId: exercise.id,
        },
      });

      exercise.series?.forEach(async (serie) => {
        if (!serie) return;
        if (!serie.reps) throw new Error("Serie reps is required");
        if (!serie.order) throw new Error("Serie order is required");

        await ctx.prisma.workoutSet.create({
          data: {
            reps: serie.reps,
            rest: serie.rest,
            setNumber: serie.order,
            workoutExerciseId: workoutExerciseId.id,
            concentric: serie.concentric,
            eccentric: serie.eccentric,
            hold: serie.hold,
          },
        });
      });
    }),
  );
}

const createPlan = protectedProcedure
  .input(createPlanInput)
  .mutation(async ({ ctx, input }) => {
    const { workouts, ...planDetails } = input;

    // Create the main Workout Plan
    const workoutPlan = await ctx.prisma.workoutPlan.create({
      data: {
        ...planDetails,
        trainerId: ctx.auth.userId,
      },
    });

    // Add workouts to the plan
    if (workouts && workouts?.length > 0) {
      await Promise.all(
        workouts.map(async (workout) => {
          const workoutPlanDay = await ctx.prisma.workoutPlanDay.create({
            data: {
              day: workout.day,
              workoutPlanId: workoutPlan.id,
              trainerId: ctx.auth.userId,
            },
          });

          if (workout.exercises && workout.exercises?.length > 0) {
            await createWorkoutExercises(input, workoutPlanDay.id, ctx);
          }
        }),
      );
    }

    return workoutPlan;
  });

export default createPlan;
