import { protectedProcedure } from "../../trpc";
import { deleteClientInput } from "./types";

const deleteClient = protectedProcedure
  .input(deleteClientInput)
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.client.deleteMany({
      where: {
        AND: [{ id: input.id }, { trainerId: ctx.auth.userId }],
      },
    });
  });

export default deleteClient;
