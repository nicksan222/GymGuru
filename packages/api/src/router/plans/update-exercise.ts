import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const setUpdateSchema = z.object({
  id: z.string(),
  setNumber: z.number(),
  reps: z.number(),
  rest: z.number(),
});

const updateExercise = protectedProcedure
  .input(
    z
      .object({
        workoutExerciseId: z.string(),
        order: z.number().optional(),
        exerciseSets: z.array(setUpdateSchema).optional(),
      })
      .refine(
        (data) => data.order !== undefined || data.exerciseSets !== undefined,
        {
          message: "At least one field to update must be provided",
        },
      ),
  )
  .mutation(async ({ ctx, input }) => {
    const operations = [];

    if (input.order !== undefined) {
      operations.push(
        ctx.prisma.workoutExercise.update({
          where: { id: input.workoutExerciseId },
          data: { order: input.order },
        }),
      );
    }

    if (input.exerciseSets && input.exerciseSets.length > 0) {
      const setUpdates = input.exerciseSets.map((set) =>
        ctx.prisma.workoutSet.update({
          where: { id: set.id },
          data: {
            setNumber: set.setNumber,
            reps: set.reps,
            rest: set.rest,
          },
        }),
      );
      operations.push(...setUpdates);
    }

    if (operations.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No updates specified",
      });
    }

    const [workoutExercise] = await ctx.prisma.$transaction(operations);
    return workoutExercise || null;
  });

export default updateExercise;
