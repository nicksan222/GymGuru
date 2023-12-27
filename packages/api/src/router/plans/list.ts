import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const listPlans = protectedProcedure
  .input(
    z.object({
      clientId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const clientEmail = ctx.auth.user?.emailAddresses[0]?.emailAddress;

    return ctx.prisma.workoutPlan.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                Client: {
                  id: input.clientId,
                },
              },
              { trainerId: ctx.auth.userId },
            ],
          },
          {
            Client: {
              email: clientEmail,
            },
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
        clientId: true,
      },
    });
  });

export default listPlans;
