import { protectedProcedure } from "../../trpc";
import { getClientInput } from "./types";

const getClient = protectedProcedure
  .input(getClientInput)
  .query(async ({ ctx, input }) => {
    return ctx.prisma.client.findFirst({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default getClient;
