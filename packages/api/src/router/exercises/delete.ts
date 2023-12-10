import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { deleteExerciseInput } from "./types";

const deleteExercise = protectedProcedure
  .input(deleteExerciseInput)
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.deleteMany({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default deleteExercise;
