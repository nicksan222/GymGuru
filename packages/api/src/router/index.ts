import { router } from "../trpc";
import { clientRouter } from "./clients/router";
import { exercisesRouter } from "./exercises/router";
import { paymentsRouter } from "./payments/router";
import { plansRouter } from "./plans/router";
import { progressRouter } from "./progress/router";
import { workoutsRouter } from "./workouts/router";

export const appRouter = router({
  clientRouter,
  progressRouter,
  exercisesRouter,
  plansRouter,
  paymentsRouter,
  workoutsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
