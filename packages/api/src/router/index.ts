import { router } from "../trpc";
import { clientRouter } from "./clients/router";
import { exercisesRouter } from "./exercises/router";
import { progressRouter } from "./progress/router";

export const appRouter = router({
  clientRouter,
  progressRouter,
  exercisesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
