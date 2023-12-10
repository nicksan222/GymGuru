import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { Toaster } from "#/components/ui/toaster";
import { useToast } from "#/components/ui/use-toast";
import { trpc } from "#/src/utils/trpc";
import { createExerciseInput } from "@acme/api/src/router/exercises/types";
import { Separator } from "@radix-ui/react-context-menu";
import * as z from "zod";
import FormAddExercise from "./form-add-exercise";

export default function AddExercise() {
  const mutation = trpc.exercisesRouter.createExercise.useMutation();
  const { toast } = useToast();

  function onSubmit(values: z.infer<typeof createExerciseInput>) {
    mutation.mutate(values);
  }

  return (
    <Sidebar>
      <Toaster />
      <DashboardTitle
        title="Aggiungi esercizio"
        subtitle="Aggiungi un nuovo esercizio"
      />
      <Separator className="my-6" />

      <FormAddExercise onSubmit={onSubmit} />
    </Sidebar>
  );
}
