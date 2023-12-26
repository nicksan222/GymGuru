import { protectedProcedure } from "../../trpc";
import { createPlanInput } from "./types";
import * as z from "zod";
import { Context } from "../../context";
import { seriesSchema } from "./types";

// Function to create workout exercises for each workout plan day
async function createWorkoutExercises(
  exercises: Array<{
    id: string;
    order: number;
    description?: string;
    series: z.infer<typeof seriesSchema>[];
  }>,
  workoutPlanDayId: string,
  ctx: Context,
) {
  if (!exercises || exercises.length === 0) return;

  await Promise.all(
    exercises.map(async (exercise) => {
      if (!exercise.order) throw new Error("Exercise order is required");
      if (!ctx.auth.userId) throw new Error("User ID is required");

      const workoutExerciseId = await ctx.prisma.workoutExercise.create({
        data: {
          order: exercise.order,
          trainerId: ctx.auth.userId,
          workoutPlanDayId: workoutPlanDayId,
          description: exercise.description,
          exerciseId: exercise.id,
        },
      });

      exercise.series?.forEach(async (serie, index) => {
        if (!serie.reps) throw new Error("Serie reps is required");

        await ctx.prisma.workoutSet.create({
          data: {
            reps: serie.reps,
            rest: serie.rest,
            setNumber: index + 1,
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
    const workoutPlan = await ctx.prisma.workoutPlan.create({
      data: {
        ...planDetails,
        trainerId: ctx.auth.userId,
      },
    });

    if (workouts && workouts.length > 0) {
      await Promise.all(
        workouts.map(async (workout) => {
          const workoutPlanDay = await ctx.prisma.workoutPlanDay.create({
            data: {
              day: workout.day,
              workoutPlanId: workoutPlan.id,
              trainerId: ctx.auth.userId,
            },
          });

          if (workout.exercises && workout.exercises.length > 0) {
            await createWorkoutExercises(
              workout.exercises.map((exercise) => ({
                description: exercise.description,
                id: exercise.id,
                order: exercise.order,
                series: exercise.series ?? [],
              })),
              workoutPlanDay.id,
              ctx,
            );
          }
        }),
      );
    }

    return workoutPlan;
  });

export default createPlan;
