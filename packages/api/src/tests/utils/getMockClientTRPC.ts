import { appRouter } from "../../router";
import { createContextInner } from "../../context";
import sessionClient from "./getMockClientContext";
import { User } from "@clerk/clerk-sdk-node";

export const getMockClientTRPC = async (userId?: string, email?: string) => {
  const ctx = await createContextInner({
    auth: {
      ...sessionClient,
      userId: userId ?? sessionClient.userId,
      user: {
        ...(sessionClient.user as User),
        emailAddresses: [
          {
            emailAddress: email ?? "",
            id: "",
            linkedTo: [],
            verification: null,
          },
        ],
      },
    },
  });
  const caller = appRouter.createCaller(ctx);

  return caller;
};
