import { protectedProcedure } from "../../trpc";
import { getNextWorkoutExercise } from "./types";

const getNextWorkoutExerciseRoute = protectedProcedure
  .input(getNextWorkoutExercise)
  .query(async ({ ctx, input }) => {});

export default getNextWorkoutExerciseRoute;
