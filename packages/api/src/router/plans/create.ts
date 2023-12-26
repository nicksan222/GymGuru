import { protectedProcedure } from "../../trpc";
import {
  createPlanInput,
  exerciseSchema,
  seriesSchema,
  workoutSchema,
} from "./types";
import * as z from "zod";
import { Context } from "../../context";
import { WorkoutPlanDay } from "@acme/db";
import { TRPCError } from "@trpc/server";

type Exercise = z.infer<typeof exerciseSchema>;
type Series = z.infer<typeof seriesSchema>;
type Workout = z.infer<typeof workoutSchema>;

// Function to create workout exercises for each workout plan day
async function createWorkoutExercises(
  exercises: Exercise[],
  workoutPlanDay: WorkoutPlanDay,
  ctx: Context,
): Promise<void> {
  if (!exercises || exercises.length === 0) return;

  for (const exercise of exercises) {
    validateExercise(exercise, ctx);
    const workoutExerciseId = await createWorkoutExercise(
      exercise,
      workoutPlanDay,
      ctx,
    );
    await createWorkoutSets(exercise.series ?? [], workoutExerciseId.id, ctx);
  }
}

function validateExercise(exercise: Exercise, ctx: Context): void {
  if (!exercise.order)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Exercise order is required",
    });
  if (!ctx.auth.userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User ID is required",
    });
  if (!exercise.series || exercise.series.length === 0)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Exercise series are required",
    });
}

function validateUser(ctx: Context): void {
  if (!ctx.auth.userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User ID is required",
    });
}

async function createWorkoutExercise(
  exercise: Exercise,
  workoutPlanDay: WorkoutPlanDay,
  ctx: Context,
): Promise<{ id: string }> {
  validateUser(ctx);

  return await ctx.prisma.workoutExercise.create({
    data: {
      order: exercise.order,
      description: exercise.description,
      Exercise: {
        connect: { id: exercise.id },
      },
      WorkoutPlanDay: {
        connect: { id: workoutPlanDay.id },
      },
      trainerId: ctx.auth.userId ?? "",
    },
  });
}

async function createWorkoutSets(
  series: Series[],
  workoutExerciseId: string,
  ctx: Context,
): Promise<void> {
  series?.forEach(async (serie, index) => {
    validateSerie(serie);
    validateUser(ctx);

    const result = await ctx.prisma.workoutSet.create({
      data: {
        concentric: serie.concentric,
        eccentric: serie.eccentric,
        hold: serie.hold,
        reps: serie.reps,
        rest: serie.rest,
        setNumber: index + 1,
        workoutExerciseId,
        trainerId: ctx.auth.userId ?? "",
      },
    });

    if (!result)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating workout set",
      });
  });
}

function validateSerie(serie: Series): void {
  if (!serie.reps)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Serie reps are required",
    });
}

const createPlan = protectedProcedure
  .input(createPlanInput)
  .mutation(async ({ ctx, input }) => {
    if (!input.workouts || input.workouts.length === 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Workouts are required",
      });

    if (!ctx.auth.userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authorized",
      });

    const workoutPlan = await createWorkoutPlan(input, ctx);
    await processWorkouts(input.workouts, workoutPlan.id, ctx);
    return workoutPlan;
  });

async function createWorkoutPlan(
  planDetails: z.infer<typeof createPlanInput>,
  ctx: Context,
) {
  validateUser(ctx);

  return await ctx.prisma.workoutPlan.create({
    data: {
      startDate: planDetails.startDate,
      endDate: planDetails.endDate,
      Client: {
        connect: { id: planDetails.clientId },
      },
      trainerId: ctx.auth.userId ?? "",
    },
  });
}

async function processWorkouts(
  workouts: Workout[],
  workoutPlanId: string,
  ctx: Context,
): Promise<void> {
  if (workouts && workouts.length > 0) {
    for (const workout of workouts) {
      const workoutPlanDay = await createWorkoutPlanDay(
        workout,
        workoutPlanId,
        ctx,
      );
      await createWorkoutExercises(
        workout.exercises || [],
        workoutPlanDay,
        ctx,
      );
    }
  }
}

async function createWorkoutPlanDay(
  workout: Workout,
  workoutPlanId: string,
  ctx: Context,
): Promise<WorkoutPlanDay> {
  validateUser(ctx);

  return await ctx.prisma.workoutPlanDay.create({
    data: {
      day: workout.day,
      workoutPlanId,
      trainerId: ctx.auth.userId ?? "",
    },
  });
}

export default createPlan;
