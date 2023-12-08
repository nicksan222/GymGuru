import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const deleteProgress = protectedProcedure
  .input(
    z.object({
      clientId: z.string(),
      progressId: z.string(),
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
      throw new Error("You are not authorized to delete progress records");
    }

    return ctx.prisma.progressRecord.delete({
      where: { id: input.progressId },
    });
  });

export default deleteProgress;
