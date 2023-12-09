import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const createPlan = protectedProcedure
  .input(
    z.object({
      clientId: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.workoutPlan.create({
      data: {
        ...input,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default createPlan;
