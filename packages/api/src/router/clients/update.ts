import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const updateClient = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      firstName: z
        .string()
        .min(2, { message: "First name is too short" })
        .optional(),
      lastName: z
        .string()
        .min(2, { message: "Last name is too short" })
        .optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      birthDate: z.date().optional(),
      medicalHistory: z.string().optional(),
    }),
  )
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
