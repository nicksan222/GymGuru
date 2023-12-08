import { protectedProcedure } from "../../trpc";
import { z } from "zod";

const updateClient = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      birthDate: z.date().optional(),
      medicalHistory: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const exists = await ctx.prisma.client.findUnique({
      where: {
        email: input.email,
      },
    });

    if (exists?.trainerId && exists?.trainerId !== ctx.auth.userId) {
      throw new Error("Client already exists for another trainer");
    }

    return ctx.prisma.client.update({
      where: {
        id: input.id,
      },
      data: {
        ...input,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default updateClient;
