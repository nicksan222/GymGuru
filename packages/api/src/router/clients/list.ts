import { protectedProcedure } from "../../trpc";

const listClients = protectedProcedure.query(async ({ ctx }) => {
  return ctx.prisma.client.findMany({
    where: {
      trainerId: ctx.auth.userId,
    },
    select: {
      firstName: true,
      lastName: true,
      id: true,
      email: true,
    },
  });
});

export default listClients;
