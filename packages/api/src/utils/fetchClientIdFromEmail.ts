import { Context } from "../context";

export const fetchClientIdFromEmail = async (ctx: Context) => {
  const email = ctx.auth.user?.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email found");
  }

  const result = await ctx.prisma.client.findFirst({
    where: { email },
    select: { id: true },
  });

  if (!result) {
    throw new Error("No client found");
  }

  return result.id;
};
