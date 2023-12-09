import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const listExercises = protectedProcedure
  .input(
    z.object({
      clientId: z.string(),
      muscleGroup: z.string().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.exercise.findMany({
      where: {
        OR: [
          {
            primaryMuscles: {
              contains: input.muscleGroup,
            },
          },
          {
            secondaryMuscles: {
              contains: input.muscleGroup,
            },
          },
        ],
        AND: [
          {
            trainerId: ctx.auth.userId,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        primaryMuscles: true,
        secondaryMuscles: true,
      },
    });
  });

export default listExercises;
