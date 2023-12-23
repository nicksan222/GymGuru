import { Button } from "#/components/ui/button";
import { createPlanInput } from "@acme/api/src/router/plans/types";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import * as z from "zod";

interface PlanDayFormProps {
  form: UseFormReturn<z.infer<typeof createPlanInput>>;
}

export default function ButtonAddDayForm({ form }: PlanDayFormProps) {
  const { getValues } = form;
  const workouts = getValues("workouts") ?? [];

  const { append } = useFieldArray({
    control: form.control,
    name: "workouts",
  });

  return (
    <Button
      type="button"
      onClick={() => {
        append({
          name: "",
          exercises: [],
          day: Math.max(...workouts.map((w) => w.day)) + 1,
        });
      }}
    >
      Aggiungi giorno
    </Button>
  );
}
