import { protectedProcedure } from "../../trpc";
import { updateClientInput } from "./types";

const updateClient = protectedProcedure
  .input(updateClientInput)
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.client.updateMany({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
      data: {
        ...input,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default updateClient;
