import { protectedProcedure } from "../../trpc";
import * as z from "zod";
import { fetchClientIdFromEmail } from "../../utils/fetchClientIdFromEmail";
import { TRPCError } from "@trpc/server";

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

    const plan = await ctx.prisma.workoutSet.findUnique({
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

    if (!plan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workout plan not found",
      });
    }

    return await ctx.prisma.workoutRecordSet.create({
      data: {
        reps: input.reps,
        rest: input.rest,
        weight: input.weight,
        WorkoutRecord: {
          connectOrCreate: {
            create: {
              trainerId: plan.trainerId,
              Client: {
                connect: {
                  id: userId,
                },
              },
              WorkoutPlanDay: {
                connect: {
                  id: plan.WorkoutPlanDay.id,
                },
              },
            },
            where: {
              id: plan.WorkoutPlanDay.id,
            },
          },
        },
      },
    });
  });

export default recordWorkoutSet;
