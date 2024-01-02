import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { Context } from "../../context";
import * as z from "zod";
import { fetchClientIdFromEmail } from "../../utils/fetchClientIdFromEmail";

// Modular function to get the active workout plan based on startingDate and endingDate
async function findActiveWorkoutPlan(ctx: Context, userId: string) {
  const currentDate = new Date();

  const user = await ctx.prisma.client.findFirst({
    where: {
      id: userId,
    },
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
    return null;
  }

  return user.WorkoutPlan[0];
}

async function isAllowed(ctx: Context, clientId: string) {
  if (!ctx.auth.userId) return false;

  const result = await ctx.prisma.client.findFirst({
    where: {
      AND: [{ trainerId: ctx.auth.userId }, { id: clientId }],
    },
  });

  return Boolean(result);
}

const getActivePlan = protectedProcedure
  .input(
    z
      .object({
        clientId: z.string(),
      })
      .optional(),
  )
  .query(async ({ ctx, input }) => {
    // If a client id is provided, then ensuring the trainer is allowed
    if (input?.clientId) {
      if (!(await isAllowed(ctx, input.clientId))) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }

    const userId = input?.clientId || (await fetchClientIdFromEmail(ctx));

    const activeWorkoutPlan = await findActiveWorkoutPlan(ctx, userId);

    if (!activeWorkoutPlan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Active workout plan not found",
      });
    }

    return { plan: activeWorkoutPlan };
  });

export default getActivePlan;
