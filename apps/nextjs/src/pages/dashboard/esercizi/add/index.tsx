import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { Toaster } from "#/components/ui/toaster";
import { toast } from "#/components/ui/use-toast";
import { trpc } from "#/src/utils/trpc";
import { createExerciseInput } from "@acme/api/src/router/exercises/types";

import * as z from "zod";
import FormAddExercise from "../../../../../components/esercizi/add/form-add-exercise";
import { useEffect } from "react";
import { Separator } from "#/components/ui/separator";

export default function AddExercise() {
  const mutation = trpc.exercisesRouter.createExercise.useMutation();

  function onSubmit(values: z.infer<typeof createExerciseInput>) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      toast({
        title: "Successo",
        description: "L'esercizio è stato creato con successo",
        color: "green",
      });
    } else if (mutation.error) {
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore durante la creazione dell'esercizio, controlla i dati inseriti",
        color: "red",
      });
    }
  }, [mutation.error, mutation.isSuccess]);

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
