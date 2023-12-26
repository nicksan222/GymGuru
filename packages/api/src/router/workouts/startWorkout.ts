import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { inputStartedWorkout } from "./types";

const startWorkoutRoute = protectedProcedure
  .input(inputStartedWorkout)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    // Does another workout exist for this user? Is it active?
    const activeWorkout = await ctx.prisma.workoutRecord.findFirst({
      where: {
        clientId: ctx.auth.user?.id,
        completedAt: {
          not: null,
        },
      },
    });

    if (activeWorkout) {
      return activeWorkout;
    }

    // Does this workout exist?
    const workout = await ctx.prisma.workoutPlan.findUnique({
      where: {
        id: input.workoutId,
      },
    });

    if (!workout) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workout not found",
      });
    }

    // Does this workout belong to the current user?
    const user = await ctx.prisma.client.findFirst({
      where: {
        email: ctx.auth.user?.emailAddresses[0]?.emailAddress,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    if (user.id !== workout.clientId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workout not belonging to user",
      });
    }

    return await ctx.prisma.workoutRecord.create({
      data: {
        trainerId: user.trainerId,
        workoutPlanDayId: workout.id,
        clientId: ctx.auth.userId,
      },
      select: {
        clientId: true,
        completedAt: true,
        createdAt: true,
        id: true,
        updatedAt: true,
        workoutPlanDayId: true,
        trainerId: true,
      },
    });
  });

export default startWorkoutRoute;
