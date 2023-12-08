import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const createProgress = protectedProcedure
  .input(
    z.object({
      clientId: z.string(),
      weight: z.number(),
      bodyFat: z.number(),
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
      throw new Error("You are not authorized to create progress records");
    }

    return ctx.prisma.progressRecord.create({
      data: {
        ...input,
        date: new Date(),
      },
    });
  });

export default createProgress;
