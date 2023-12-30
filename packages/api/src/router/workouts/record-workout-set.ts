import { protectedProcedure } from "../../trpc";
import * as z from "zod";
import { TRPCError } from "@trpc/server";
import fetchClientEmailFromId from "../../utils/fetchClientEmailFromId";
import { fetchClientIdFromEmail } from "../../utils/fetchClientIdFromEmail";

const recordWorkoutSet = protectedProcedure
  .input(
    z.object({
      setId: z.string(),
      reps: z.number(),
      weight: z.number(),
      rest: z.number(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const userId = await fetchClientIdFromEmail(ctx);

    // Does the workoutRecord already exist? If not, create it
    const workoutRecord = await ctx.prisma.workoutRecord.findFirst({
      where: {
        WorkoutPlanDay: {
          WorkoutSet: {
            some: {
              id: input.setId,
            },
          },
        },
      },
    });

    if (!workoutRecord) {
      throw new TRPCError({
        message: "Workout not started",
        code: "BAD_REQUEST",
      });
    }

    // Find the set
    const set = await prisma?.workoutSet.findUnique({
      where: {
        id: input.setId,
      },
      include: {
        WorkoutPlanDay: {
          include: {
            WorkoutPlan: true,
          },
        },
      },
    });

    if (!set) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not find the set id",
      });
    }

    // The workout should be in progress
    const workoutRecordInProgress = await ctx.prisma.workoutRecord.findFirst({
      where: {
        AND: [
          {
            Client: {
              id: userId,
            },
          },
          {
            completedAt: null,
          },
        ],
      },
    });

    if (!workoutRecordInProgress) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No workout in progress found",
      });
    }

    return await ctx.prisma.workoutRecordSet.create({
      data: {
        reps: input.reps,
        rest: input.rest,
        weight: input.weight,
        WorkoutRecord: {
          connect: {
            id: workoutRecordInProgress.id,
          },
        },
        WorkoutSet: {
          connect: {
            id: input.setId,
          },
        },
      },
    });
  });

export default recordWorkoutSet;
