import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const deleteClient = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.client.deleteMany({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default deleteClient;
