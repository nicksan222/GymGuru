import { createPlanInput } from "@acme/api/src/router/plans/types";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import PlanDayExerciseForm from "./plan-day-exercise-form";
import { PlanDayAddExerciseDialog } from "./plan-day-add-exercise-dialog";
import { trpc } from "#/src/utils/trpc";

interface PlanDayFormProps {
  form: UseFormReturn<z.infer<typeof createPlanInput>>;
  workoutIndex: number;
}

export default function PlanDayForm({ form, workoutIndex }: PlanDayFormProps) {
  const { watch } = form;
  const workouts = watch().workouts ?? [];
  const workout = workouts[workoutIndex];

  const exercises = trpc.exercisesRouter.listExercises.useQuery({});

  if (!workout) {
    return null;
  }

  return (
    <div className="rounded-xl border-2 border-r-2 p-4">
      <h2 className="text-xl font-semibold">Giorno {workoutIndex + 1}</h2>

      <div className="my-4 grid gap-4 md:grid-cols-1">
        {workout.exercises?.map((exercise) => (
          <div
            key={exercise.id}
            className="rounded-xl border-2 border-r-2 p-4 "
          >
            <PlanDayExerciseForm
              form={form}
              workoutIndex={workoutIndex}
              exerciseIndex={exercise.order}
              exerciseName={
                exercises.data?.find((e) => e.id === exercise.id)?.name ?? ""
              }
            />
          </div>
        ))}
      </div>

      <PlanDayAddExerciseDialog form={form} workoutIndex={workoutIndex} />
    </div>
  );
}
