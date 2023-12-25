import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const getPlan = protectedProcedure
  .input(
    z.object({
      planId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const workoutPlan = await ctx.prisma.workoutPlan.findFirst({
      where: {
        AND: [
          {
            id: input.planId,
          },
          {
            trainerId: ctx.auth.userId,
          },
        ],
      },
    });

    const workoutPlanDays = await ctx.prisma.workoutPlanDay.findMany({
      where: {
        workoutPlanId: input.planId,
      },
    });

    const dayIds = workoutPlanDays.map((day) => day.id);
    const workoutPlanExercises = await ctx.prisma.workoutExercise.findMany({
      where: {
        workoutPlanDayId: {
          in: dayIds,
        },
      },
    });

    const exerciseIds = workoutPlanExercises.map((exercise) => exercise.id);
    const workoutPlanSeries = await ctx.prisma.workoutSet.findMany({
      where: {
        workoutExerciseId: {
          in: exerciseIds,
        },
      },
    });

    // Efficient data mapping
    const days = workoutPlanDays.map((day) => {
      const exercises = workoutPlanExercises
        .filter((exercise) => exercise.workoutPlanDayId === day.id)
        .map((exercise) => {
          return {
            ...exercise,
            series: workoutPlanSeries.filter(
              (series) => series.workoutExerciseId === exercise.id,
            ),
          };
        });

      return {
        info: day,
        exercises: exercises,
      };
    });

    return {
      plan: workoutPlan,
      days: days,
    };
  });

export default getPlan;
