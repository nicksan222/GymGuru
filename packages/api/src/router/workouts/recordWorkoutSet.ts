import { protectedProcedure } from "../../trpc";
import { getNextWorkoutExercise } from "./types";

const recordWorkoutSetRoute = protectedProcedure
  .input(getNextWorkoutExercise)
  .query(async ({ ctx, input }) => {});

export default recordWorkoutSetRoute;
