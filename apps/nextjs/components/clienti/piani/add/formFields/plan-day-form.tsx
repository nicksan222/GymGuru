import { createPlanInput } from "@acme/api/src/router/plans/types";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import * as z from "zod";
import PlanDayExerciseForm from "./plan-day-exercise-form";
import { PlanDayAddExerciseDialog } from "./plan-day-add-exercise-dialog";
import { trpc } from "#/src/utils/trpc";
import { Button } from "#/components/ui/button";

interface PlanDayFormProps {
  form: UseFormReturn<z.infer<typeof createPlanInput>>;
  workoutIndex: number;
}

export default function PlanDayForm({ form, workoutIndex }: PlanDayFormProps) {
  const { watch } = form;
  const workouts = watch().workouts ?? [];
  const workout = workouts[workoutIndex];

  const exercises = trpc.exercisesRouter.listExercises.useQuery({});

  const { remove } = useFieldArray({
    control: form.control,
    name: `workouts`,
  });

  if (!workout) {
    return null;
  }

  return (
    <div className="rounded-xl border-2 border-r-2 p-4">
      <h2 className="text-xl font-semibold">Giorno {workoutIndex + 1}</h2>

      <div className="my-4 grid gap-4 md:grid-cols-1">
        {workout.exercises?.map((exercise, index) => (
          <div
            key={exercise.id + "" + index}
            className="rounded-xl border-2 border-r-2 p-4 "
          >
            <PlanDayExerciseForm
              workoutIndex={workoutIndex}
              exerciseIndex={index}
              exerciseName={
                exercises.data?.find((e) => e.id === exercise.id)?.name ?? ""
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-row justify-between">
        <PlanDayAddExerciseDialog form={form} workoutIndex={workoutIndex} />
        <Button
          variant="secondary"
          className="bg-red-500 text-white hover:text-black"
          onClick={() => remove(workoutIndex)}
        >
          Elimina giorno
        </Button>
      </div>
    </div>
  );
}
