import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import * as z from "zod";
import fetchClientEmailFromId from "../../utils/fetchClientEmailFromId";

const endWorkout = protectedProcedure
  .input(
    z.object({
      workoutPlanDayId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Getting the active workout record for the workoutDayId
    const workoutRecord = await ctx.prisma.workoutRecord.findFirst({
      where: {
        WorkoutPlanDay: {
          id: input.workoutPlanDayId,
        },
        Client: {
          email: await fetchClientEmailFromId(ctx),
        },
      },
    });

    if (!workoutRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No workout found",
      });
    }

    // Update the workout record
    const updatedWorkout = await ctx.prisma.workoutRecord.update({
      where: {
        id: workoutRecord.id,
      },
      data: {
        completedAt: new Date(),
      },
    });

    return updatedWorkout;
  });

export default endWorkout;
