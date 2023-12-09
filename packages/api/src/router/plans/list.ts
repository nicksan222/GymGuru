import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const listPlans = protectedProcedure
  .input(
    z.object({
      clientId: z.string().uuid(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.workoutPlan.findMany({
      where: {
        AND: [
          {
            clientId: input.clientId,
          },
          {
            trainerId: ctx.auth.userId,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  });

export default listPlans;
