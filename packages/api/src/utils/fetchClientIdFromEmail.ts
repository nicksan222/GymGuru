import { Context } from "../context";
import fetchClientEmailFromId from "./fetchClientEmailFromId";

export const fetchClientIdFromEmail = async (ctx: Context) => {
  let email = ctx.auth.user?.emailAddresses[0]?.emailAddress;
  if (!email) {
    email = await fetchClientEmailFromId(ctx);
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
