import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const deleteClient = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const result = await ctx.prisma.client.delete({
      where: {
        id: input.id,
      },
    });

    if (result.trainerId === ctx.auth.userId) {
      throw new Error("You are not authorized to delete this client.");
    }

    return result;
  });

export default deleteClient;
