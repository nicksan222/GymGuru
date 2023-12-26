import { router } from "../../trpc";
import getNextWorkoutExerciseRoute from "./getNextWorkoutExercise";
import startWorkoutRoute from "./startWorkout";

export const workoutsRouter = router({
  startWorkoutRoute,
  getNextWorkoutExerciseRoute,
});
