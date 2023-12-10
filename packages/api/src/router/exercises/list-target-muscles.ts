import { protectedProcedure } from "../../trpc";
import { MuscleTarget } from "@acme/db";

const listTargetMuscles = protectedProcedure.query(async ({}) => {
  const response = Object.values(MuscleTarget).filter(
    (v) => typeof v === "string",
  );
  return response as string[];
});

export default listTargetMuscles;
