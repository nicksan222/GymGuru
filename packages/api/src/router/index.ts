import { router } from "../trpc";
import { clientRouter } from "./clients/router";

export const appRouter = router({
  clientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
