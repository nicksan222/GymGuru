import { router } from "../../trpc";
import addExercise from "./addExercise";
import createPlan from "./create";
import deletePlan from "./delete";
import deleteExercise from "./deleteExercise";
import getPlan from "./get";
import listPlans from "./list";
import updatePlan from "./update";
import updateExercise from "./updateExercise";

export const plansRouter = router({
  createPlan,
  deletePlan,
  getPlan,
  listPlans,
  updatePlan,
  updateExercise,
  addExercise,
  deleteExercise,
});
