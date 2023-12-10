import { protectedProcedure } from "../../trpc";
import { createClientInput } from "./types";

const createClient = protectedProcedure
  .input(createClientInput)
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.client.create({
      data: {
        ...input,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default createClient;
