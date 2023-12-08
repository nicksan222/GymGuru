import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const getClient = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const result = await ctx.prisma.client.findUnique({
      where: {
        id: input.id,
      },
    });

    if (result?.trainerId !== ctx.auth.userId) {
      throw new Error("You are not authorized to view this client.");
    }

    return result;
  });

export default getClient;
