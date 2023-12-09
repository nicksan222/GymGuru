import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const deleteProgress = protectedProcedure
  .input(
    z.object({
      clientId: z.string(),
      progressId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.progressRecord.deleteMany({
      where: {
        AND: [
          { id: input.progressId },
          { clientId: input.clientId },
          { trainerId: ctx.auth.userId },
        ],
      },
    });
  });

export default deleteProgress;
