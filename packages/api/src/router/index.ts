import { router } from "../trpc";
import { clientRouter } from "./clients/router";
import { exercisesRouter } from "./exercises/router";
import { plansRouter } from "./plans/router";
import { progressRouter } from "./progress/router";

export const appRouter = router({
  clientRouter,
  progressRouter,
  exercisesRouter,
  plansRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
