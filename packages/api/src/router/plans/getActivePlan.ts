import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { Context } from "../../context";

// Modular function to get the active workout plan based on startingDate and endingDate
async function findActiveWorkoutPlan(ctx: Context) {
  const currentDate = new Date();

  const user = await ctx.prisma.client.findFirst({
    where: { email: ctx.auth.user?.emailAddresses[0]?.emailAddress },
    include: {
      WorkoutPlan: {
        where: {
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        },
        include: {
          WorkoutPlanDay: {
            orderBy: { day: "asc" },
            include: {
              WorkoutExercise: {
                include: {
                  Exercise: true,
                  WorkoutSet: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || user.WorkoutPlan.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Active workout plan not found",
    });
  }

  return user.WorkoutPlan[0];
}

const getActivePlan = protectedProcedure.query(async ({ ctx }) => {
  const activeWorkoutPlan = await findActiveWorkoutPlan(ctx);

  return { plan: activeWorkoutPlan };
});

export default getActivePlan;
