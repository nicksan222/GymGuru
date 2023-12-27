import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const deleteExercise = protectedProcedure
  .input(
    z.object({
      workoutExerciseId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Ensure that the trainer is authorized to delete the workout exercise
    const workoutExercise = await ctx.prisma.workoutExercise.findFirst({
      where: {
        id: input.workoutExerciseId,
        trainerId: ctx.auth.userId,
      },
    });

    // If no workout exercise is found, or the trainer IDs do not match, throw an error
    if (!workoutExercise) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to delete this workout exercise",
      });
    }

    // Delete the workout exercise
    return ctx.prisma.workoutExercise.delete({
      where: {
        id: input.workoutExerciseId,
      },
    });
  });

export default deleteExercise;
