import { Toaster } from "#/components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "#/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@radix-ui/react-dropdown-menu";
import PlanDayForm from "./formFields/plan-day-form";
import ButtonAddDayForm from "./formFields/button-add-day-form";
import { Button } from "#/components/ui/button";
import PlanDatePicker from "./formFields/date-picker";
import { createPlanInput } from "@acme/api/src/router/plans/create-types";

interface Props {
  clientId: string;
  onSubmit(values: z.infer<typeof createPlanInput>): void;
}

export default function FormAddWorkoutPlan({ onSubmit, clientId }: Props) {
  const form = useForm<z.infer<typeof createPlanInput>>({
    resolver: zodResolver(createPlanInput),
    defaultValues: {
      clientId,
      endDate: new Date(),
      startDate: new Date(),
      workouts: [],
    },
    mode: "onSubmit",
  });

  const { watch } = form;

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Separator className="mb-4" />

        {watch().workouts?.map((_, index) => (
          <PlanDayForm key={index} form={form} workoutIndex={index} />
        ))}

        <div className="grid grid-cols-1 gap-4">
          <h2>Validità piano</h2>
          <PlanDatePicker />
        </div>

        <div className="flex flex-row justify-between">
          <ButtonAddDayForm form={form} />
          <Button>Salva</Button>
        </div>
      </form>
    </Form>
  );
}
