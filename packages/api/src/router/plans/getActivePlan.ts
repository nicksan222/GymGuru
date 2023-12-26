import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { Context } from "../../context";

// Modular function to get the active workout plan based on startingDate and endingDate
async function findActiveWorkoutPlan(ctx: Context) {
  const currentDate = new Date();

  const user = await ctx.prisma.client.findFirst({
    where: { email: ctx.auth.user?.emailAddresses[0]?.emailAddress },
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return await ctx.prisma.workoutPlan.findFirst({
    where: {
      AND: [
        { clientId: user.id },
        { startDate: { lte: currentDate } },
        { endDate: { gte: currentDate } },
      ],
    },
  });
}

const getActivePlan = protectedProcedure.query(async ({ ctx }) => {
  const activeWorkoutPlan = await findActiveWorkoutPlan(ctx);

  if (!activeWorkoutPlan) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Active plan not found",
    });
  }

  // Fetch workout plan days, exercises, and series
  const workoutPlanDays = await ctx.prisma.workoutPlanDay.findMany({
    where: { workoutPlanId: activeWorkoutPlan.id },
    orderBy: { day: "asc" },
  });

  const workoutPlanExercises = await ctx.prisma.workoutExercise.findMany({
    where: { workoutPlanDayId: { in: workoutPlanDays.map((day) => day.id) } },
  });

  const workoutPlanSeries = await ctx.prisma.workoutSet.findMany({
    where: {
      workoutExerciseId: {
        in: workoutPlanExercises.map((exercise) => exercise.id),
      },
    },
  });

  const exercisesDetails = await ctx.prisma.exercise.findMany({
    where: {
      id: { in: workoutPlanExercises.map((exercise) => exercise.exerciseId) },
    },
  });

  // Map days to exercises and series
  const days = workoutPlanDays.map((day) => ({
    dayInfo: day,
    exercises: workoutPlanExercises
      .filter((exercise) => exercise.workoutPlanDayId === day.id)
      .map((exercise) => ({
        exerciseInfo: exercisesDetails.find(
          (detail) => detail.id === exercise.exerciseId,
        ),
        series: workoutPlanSeries.filter(
          (series) => series.workoutExerciseId === exercise.id,
        ),
      })),
  }));

  console.info(JSON.stringify(days, null, 2));

  return { plan: activeWorkoutPlan, days };
});

export default getActivePlan;
