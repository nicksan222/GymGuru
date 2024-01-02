import { Context } from "../context";
import getMockIdentities from "../tests/utils/getMockIdentities";
import fetchClientEmailFromId from "./fetchClientEmailFromId";

export const fetchClientIdFromEmail = async (ctx: Context) => {
  if (process.env.NODE_ENV === "test") {
    return (await getMockIdentities()).recordClient.id;
  }

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
