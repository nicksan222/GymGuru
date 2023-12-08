import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const listClients = protectedProcedure
  .input(z.object({}))
  .query(async ({ ctx }) => {
    return ctx.prisma.client.findMany({
      where: {
        trainerId: ctx.auth.userId,
      },
    });
  });

export default listClients;
