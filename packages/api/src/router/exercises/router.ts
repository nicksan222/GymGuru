import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../../trpc";
import createExercise from "./create";
import deleteExercise from "./delete";
import getExercise from "./get";
import listExercises from "./list";
import listExerciseCategories from "./list-exercise-categories";
import listTargetMuscles from "./list-target-muscles";
import updateExercise from "./update";

export const exercisesRouter = router({
  createExercise,
  deleteExercise,
  updateExercise,
  getExercise,
  listTargetMuscles,
  listExercises,
  listExerciseCategories,
});

export type ExercisesRouterInput = inferRouterInputs<typeof exercisesRouter>;
export type ExercisesRouterOutput = inferRouterOutputs<typeof exercisesRouter>;
