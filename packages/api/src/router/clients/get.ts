import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const getClient = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.prisma.client.findFirst({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default getClient;
