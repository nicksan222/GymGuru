import {
  Exercise,
  WorkoutExercise,
  WorkoutPlan,
  WorkoutPlanDay,
} from "@acme/db";
import PianoDetailSkeleton from "./piano-detail-skeleton";
import PlanDayDetail from "./day-detail";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@acme/api";
import GraphBodyTargetsFrequencies from "./graph-body-targets-frequencies";

type PlanDetails = inferRouterOutputs<AppRouter["plansRouter"]>;

interface Props {
  plan: WorkoutPlan | undefined | null;
  days: PlanDetails["getPlan"]["days"];
  exercises: Map<string, Exercise>;
}

export default function PianoDetail({ days, plan, exercises }: Props) {
  if (!days || !plan) return <PianoDetailSkeleton />;

  const getExercisesModels = () => {
    const exercisesModels: Map<string, Exercise> = new Map();
    exercises.forEach((exercise) => {
      exercisesModels.set(exercise.id, exercise);
    });
    return exercisesModels;
  };

  return (
    <div className="grid pt-4 md:grid-cols-2">
      <div className="grid grid-cols-1 gap-4">
        {days.map((day) => {
          return (
            <PlanDayDetail
              key={day.info.id}
              info={day.info}
              exercises={day.exercises}
              exercisesModels={getExercisesModels()}
            />
          );
        })}
      </div>
      <div>
        <h2 className="ml-12 mb-16 text-xl font-bold">Frequenza target</h2>
        <GraphBodyTargetsFrequencies
          exercises={days.map((day) => day.exercises).flat()}
          exercisesModels={getExercisesModels()}
        />
      </div>
    </div>
  );
}
