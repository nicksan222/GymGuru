import { protectedProcedure } from "../../trpc";
import { createPlanInput } from "./create-types";
import { TRPCError } from "@trpc/server";

const createPlan = protectedProcedure
  .input(createPlanInput)
  .mutation(async ({ ctx, input }) => {
    if (!input.workouts || input.workouts.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Workouts are required",
      });
    }
    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authorized",
      });
    }
    if (!input.clientId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Client ID is required",
      });
    }

    // Create the WorkoutPlan
    const workoutPlan = await ctx.prisma.workoutPlan.create({
      data: {
        startDate: input.startDate,
        endDate: input.endDate,
        clientId: input.clientId,
        trainerId: ctx.auth.userId,
      },
    });

    // Create WorkoutPlanDays and their associated WorkoutExercises
    for (const workout of input.workouts) {
      const workoutPlanDay = await ctx.prisma.workoutPlanDay.create({
        data: {
          day: workout.day,
          workoutPlanId: workoutPlan.id,
          trainerId: ctx.auth.userId,
        },
      });

      for (const exercise of workout.exercises) {
        const workoutExercise = await ctx.prisma.workoutExercise.create({
          data: {
            order: exercise.order,
            exerciseId: exercise.id,
            description: exercise.description,
            workoutPlanDayId: workoutPlanDay.id,
            trainerId: ctx.auth.userId,
          },
        });

        // Create WorkoutSets for each WorkoutExercise
        for (const series of exercise.series) {
          await ctx.prisma.workoutSet.create({
            data: {
              setNumber: series.order,
              reps: series.reps,
              rest: series.rest,
              hold: series.hold,
              eccentric: series.eccentric,
              concentric: series.concentric,
              workoutExerciseId: workoutExercise.id,
              trainerId: ctx.auth.userId,
              workoutPlanDayId: workoutPlanDay.id,
            },
          });
        }
      }
    }

    return workoutPlan;
  });

export default createPlan;
