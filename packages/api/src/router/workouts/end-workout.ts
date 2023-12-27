import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const endWorkout = protectedProcedure
  .input(
    z.object({
      workoutId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Does another workout exist for this user? Is it active?
    const activeWorkout = await ctx.prisma.workoutRecord.findFirst({
      where: {
        clientId: ctx.auth.user?.id,
        completedAt: {
          not: null,
        },
      },
    });

    if (!activeWorkout) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No active workout",
      });
    }

    // Update the workout record
    const updatedWorkout = await ctx.prisma.workoutRecord.update({
      where: {
        id: activeWorkout.id,
      },
      data: {
        completedAt: new Date(),
      },
    });

    return updatedWorkout;
  });

export default endWorkout;
