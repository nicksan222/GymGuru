import { router } from "../../trpc";
import createExercise from "./create";
import deleteExercise from "./delete";
import getExercise from "./get";
import listExercises from "./list";
import listTargetMuscles from "./list-target-muscles";
import updateExercise from "./update";

export const exercisesRouter = router({
  createExercise,
  deleteExercise,
  updateExercise,
  getExercise,
  listTargetMuscles,
  listExercises,
});
