import { createClerkClient } from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import getMockIdentities from "../tests/utils/getMockIdentities";

const clerk = createClerkClient({
  apiKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default async function fetchClientEmailFromId(ctx: Context) {
  if (process.env.NODE_ENV === "test") {
    return (await getMockIdentities()).recordClient.email;
  }

  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    });
  }

  if (ctx.auth.user?.emailAddresses?.[0]?.emailAddress) {
    return ctx.auth.user.emailAddresses[0].emailAddress;
  }

  const user = await clerk.users.getUser(ctx.auth.userId);

  if (
    !user ||
    !user?.emailAddresses ||
    !user?.emailAddresses[0]?.emailAddress
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    });
  }

  return user.emailAddresses[0].emailAddress;
}
