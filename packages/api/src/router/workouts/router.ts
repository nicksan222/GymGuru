import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../../trpc";
import getNextWorkoutExercise from "./get-next-workout-exercise";
import startWorkout from "./start-workout";
import endWorkout from "./end-workout";
import recordWorkoutSet from "./record-workout-set";

export const workoutsRouter = router({
  startWorkout,
  endWorkout,
  getNextWorkoutExercise,
  recordWorkoutSet,
});

export type WorkoutsRouterInputs = inferRouterInputs<typeof workoutsRouter>;
export type WorkoutRouterOutput = inferRouterOutputs<typeof workoutsRouter>;
