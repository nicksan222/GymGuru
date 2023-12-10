import { trpc } from "#/src/utils/trpc";

export default function ExercisesList() {
  const targetMuscleGroups = trpc.exercisesRouter.listTargetMuscles.useQuery();
  const exercises = trpc.exercisesRouter.listExercises.useQuery({});
}
