import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { getExerciseInput } from "./types";

const getExercise = protectedProcedure
  .input(getExerciseInput)
  .query(async ({ ctx, input }) => {
    return ctx.prisma.exercise.findFirst({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default getExercise;
