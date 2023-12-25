import { Exercise, WorkoutPlanDay } from "@acme/db";
import PlanExerciseDetail from "./exercise-details";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@acme/api";

type PlanDetails = inferRouterOutputs<AppRouter["plansRouter"]>;

interface Props {
  info: WorkoutPlanDay;
  exercises: PlanDetails["getPlan"]["days"][0]["exercises"];
  exercisesModels: Map<string, Exercise>;
}

export default function PlanDayDetail({
  info,
  exercises,
  exercisesModels,
}: Props) {
  return (
    <div className="rounded-xl border-2 border-r-2 p-4">
      <h2 className="grid grid-cols-1 gap-4 text-xl font-semibold">
        Giorno {info.day}
      </h2>
      {exercises.map((exercise) => {
        return (
          <div
            key={exercise.id}
            className="my-4 flex items-center justify-between rounded-lg border-2 border-r-2 p-4"
          >
            <PlanExerciseDetail
              details={exercise}
              exercisesModel={exercisesModels.get(exercise.exerciseId)}
            />
          </div>
        );
      })}
    </div>
  );
}
