import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { Toaster } from "#/components/ui/toaster";
import { toast } from "#/components/ui/use-toast";
import { trpc } from "#/src/utils/trpc";
import { createExerciseInput } from "@acme/api/src/router/exercises/types";

import * as z from "zod";

import { useEffect } from "react";
import { Separator } from "#/components/ui/separator";
import { createPlanInput } from "@acme/api/src/router/plans/types";
import FormAddPiano from "#/components/clienti/piani/add/form-add-piano";
import FormAddWorkoutPlan from "#/components/clienti/piani/add/form-add-piano";
import { useRouter } from "next/router";

export default function AddPlan() {
  const mutation = trpc.plansRouter.createPlan.useMutation();

  function onSubmit(values: z.infer<typeof createPlanInput>) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      toast({
        title: "Successo",
        description: "Il piano è stato creato con successo",
        color: "green",
      });
    } else if (mutation.error) {
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore durante la creazione del piano, controlla i dati inseriti",
        color: "red",
      });
    }
  }, [mutation.error, mutation.isSuccess]);

  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return null;
  }

  return (
    <Sidebar>
      <Toaster />
      <DashboardTitle
        title="Nuovo piano"
        subtitle="Aggiungi un nuovo piano di allenamento"
      />
      <Separator className="my-6" />

      <FormAddWorkoutPlan onSubmit={onSubmit} clientId={id} />
    </Sidebar>
  );
}
