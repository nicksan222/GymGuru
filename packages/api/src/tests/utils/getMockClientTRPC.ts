import { appRouter } from "../../router";
import { createContextInner } from "../../context";
import sessionTrainer from "./getMockTrainerContext";

export const getMockClientTRPC = async () => {
  const ctx = await createContextInner({
    auth: sessionTrainer,
  });
  const caller = appRouter.createCaller(ctx);

  return caller;
};
