import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const listProgress = protectedProcedure
  .input(
    z.object({
      clientId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const client = await ctx.prisma.client.findUnique({
      where: { id: input.clientId },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    if (!client.trainerId || client.trainerId !== ctx.auth.userId) {
      throw new Error("You are not authorized to view progress records");
    }

    return ctx.prisma.progressRecord.findMany({
      where: { clientId: input.clientId },
      orderBy: { date: "desc" },
    });
  });

export default listProgress;
