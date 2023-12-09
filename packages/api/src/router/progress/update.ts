import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const updateProgress = protectedProcedure
  .input(
    z.object({
      clientId: z.string(),
      progressId: z.string(),
      weight: z.number().optional(),
      bodyFat: z.number().optional(),
      armCircumference: z.number().optional(),
      chestCircumference: z.number().optional(),
      waistCircumference: z.number().optional(),
      hipCircumference: z.number().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.progressRecord.updateMany({
      where: {
        AND: [
          { id: input.progressId },
          { clientId: input.clientId },
          { trainerId: ctx.auth.userId },
        ],
      },
      data: {
        ...input,
      },
    });
  });

export default updateProgress;
