import { appRouter } from "../../router";
import { createContextInner } from "../../context";
import sessionTrainer from "./getMockTrainerContext";

export const getMockTrainerTRPC = async (userId: string, email?: string) => {
  const ctx = await createContextInner({
    auth: {
      ...sessionTrainer,
      userId: userId,
    },
  });
  const caller = appRouter.createCaller(ctx);

  return caller;
};

export const getMockTrainerId = async (userId?: string) => {
  const ctx = await createContextInner({
    auth: {
      ...sessionTrainer,
      userId: userId || sessionTrainer.userId,
    },
  });

  return ctx.auth.userId;
};
