import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const getPlan = protectedProcedure
  .input(z.object({ planId: z.string() }))
  .query(async ({ ctx, input }) => {
    const userId = ctx.auth.userId;
    const clientEmail = ctx.auth.user?.emailAddresses[0]?.emailAddress;

    const workoutPlan = await ctx.prisma.workoutPlan.findFirst({
      where: {
        OR: [
          { AND: [{ id: input.planId }, { trainerId: userId }] },
          { AND: [{ id: input.planId }, { Client: { email: clientEmail } }] },
        ],
      },
      include: {
        WorkoutPlanDay: {
          include: {
            WorkoutExercise: {
              include: {
                WorkoutSet: true,
              },
            },
          },
        },
      },
    });

    if (!workoutPlan) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found" });
    }

    return workoutPlan;
  });

export default getPlan;
