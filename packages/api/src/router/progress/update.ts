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
    const client = await ctx.prisma.client.findUnique({
      where: { id: input.clientId },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    if (!client.trainerId || client.trainerId !== ctx.auth.userId) {
      throw new Error("You are not authorized to update progress records");
    }

    return ctx.prisma.progressRecord.update({
      where: { id: input.progressId },
      data: {
        ...input,
      },
    });
  });

export default updateProgress;
