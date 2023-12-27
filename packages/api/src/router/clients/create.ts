import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const createClient = protectedProcedure
  .input(
    z.object({
      firstName: z.string().min(2, { message: "First name is too short" }),
      lastName: z.string().min(2, { message: "Last name is too short" }),
      email: z.string().email(),
      phone: z.string().optional(),
      birthDate: z.date(),
      medicalHistory: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.client.create({
      data: {
        ...input,
        trainerId: ctx.auth.userId,
      },
    });
  });

export default createClient;
