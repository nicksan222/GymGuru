import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import * as z from "zod";
import { fetchClientIdFromEmail } from "../../utils/fetchClientIdFromEmail";

const startWorkout = protectedProcedure
  .input(
    z.object({
      workoutId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = await fetchClientIdFromEmail(ctx);

    // Does another currently running workout exist?
    const currentWorkout = await ctx.prisma.workoutRecord.findFirst({
      where: {
        Client: {
          id: userId,
        },
        completedAt: null,
      },
    });

    if (currentWorkout) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A workout is already running",
      });
    }

    const workoutPlanDay = await ctx.prisma.workoutPlanDay.findFirst({
      where: {
        id: input.workoutId,
      },
      include: {
        WorkoutPlan: true,
      },
    });

    if (
      !workoutPlanDay ||
      !workoutPlanDay.trainerId ||
      workoutPlanDay.WorkoutPlan.clientId !== userId
    ) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workout not found for this user",
      });
    }

    // Creating a new workout start
    return await ctx.prisma.workoutRecord.create({
      data: {
        trainerId: workoutPlanDay?.trainerId,
        Client: {
          connect: {
            id: userId,
          },
        },
        WorkoutPlanDay: {
          connect: {
            id: input.workoutId,
          },
        },
      },
    });
  });

export default startWorkout;
