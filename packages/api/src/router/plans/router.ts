import { router } from "../../trpc";
import createPlan from "./create";
import deletePlan from "./delete";
import deleteExercise from "./deleteExercise";
import getPlan from "./get";
import getActivePlan from "./getActivePlan";
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
  deleteExercise,
  getActivePlan,
});
