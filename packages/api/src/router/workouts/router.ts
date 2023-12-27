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
