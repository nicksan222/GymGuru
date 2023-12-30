import { router } from "../../trpc";
import createPlan from "./create";
import deletePlan from "./delete";
import getPlan from "./get";
import getActivePlan from "./get-active-plan";
import getRecordsFroPlanDay from "./get-records-for-plan-day";
import listPlans from "./list";
import updatePlan from "./update";
import updateExercise from "./update-exercise";

export const plansRouter = router({
  createPlan,
  deletePlan,
  getPlan,
  listPlans,
  updatePlan,
  updateExercise,
  getActivePlan,
  getRecordsFroPlanDay,
});
