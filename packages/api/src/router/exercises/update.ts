import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { updateExerciseInput } from "./types";

const updateExercise = protectedProcedure
  .input(updateExerciseInput)
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.updateMany({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
      data: {
        trainerId: ctx.auth.userId,
        ...input,
        imageUrl: (input.imageUrl || []).join(","),
      },
    });
  });

export default updateExercise;
