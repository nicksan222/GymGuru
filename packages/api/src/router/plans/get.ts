import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Context } from "../../context";

// Modular function to get workout plan
async function findWorkoutPlan(ctx: Context, planId: string, userId: string) {
  return await ctx.prisma.workoutPlan.findFirst({
    where: {
      AND: [{ id: planId }, { trainerId: userId }],
    },
  });
}

// Modular function to get client by email
async function findClientByEmail(ctx: Context, email: string) {
  return await ctx.prisma.client.findFirst({
    where: { email: { in: email } },
  });
}

// Main procedure
const getPlan = protectedProcedure
  .input(z.object({ planId: z.string() }))
  .query(async ({ ctx, input }) => {
    const userId = ctx.auth.userId;
    let workoutPlan = await findWorkoutPlan(ctx, input.planId, userId);

    if (!workoutPlan) {
      const client = await findClientByEmail(
        ctx,
        ctx.auth.user?.emailAddresses[0]?.emailAddress ?? "",
      );
      if (!client) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found" });
      }

      workoutPlan = await findWorkoutPlan(ctx, input.planId, client.id);
    }

    // Refactor repeated database queries into functions
    const workoutPlanDays = await ctx.prisma.workoutPlanDay.findMany({
      where: { workoutPlanId: input.planId },
    });
    const dayIds = workoutPlanDays.map((day) => day.id);

    const workoutPlanExercises = await ctx.prisma.workoutExercise.findMany({
      where: { workoutPlanDayId: { in: dayIds } },
    });
    const exerciseIds = workoutPlanExercises.map((exercise) => exercise.id);

    const workoutPlanSeries = await ctx.prisma.workoutSet.findMany({
      where: { workoutExerciseId: { in: exerciseIds } },
    });

    // Map days to exercises and series
    const days = workoutPlanDays.map((day) => ({
      info: day,
      exercises: workoutPlanExercises
        .filter((exercise) => exercise.workoutPlanDayId === day.id)
        .map((exercise) => ({
          ...exercise,
          series: workoutPlanSeries.filter(
            (series) => series.workoutExerciseId === exercise.id,
          ),
        })),
    }));

    return { plan: workoutPlan, days };
  });

export default getPlan;
