import { trpc } from "#/src/utils/trpc";
import { useRouter } from "next/router";
import { Sidebar } from "#/components/sidebar";
import DashboardTitle from "#/components/header/title";
import FormEditExercise from "#/components/esercizi/edit/form-edit-exercise";
import { Toaster } from "#/components/ui/toaster";
import { updateExerciseInput } from "@acme/api/src/router/exercises/types";
import * as z from "zod";

export default function EditExerciseView() {
  const router = useRouter();
  const id = router.query.id;

  if (typeof id !== "string") return null;

  const mutation = trpc.exercisesRouter.updateExercise.useMutation();
  const exercise = trpc.exercisesRouter.getExercise.useQuery({ id });

  if (exercise.error || !exercise.data) {
    return (
      <Sidebar>
        <DashboardTitle
          title="Errore"
          subtitle="
            Si è verificato un errore durante il caricamento dell'esercizio"
        />
      </Sidebar>
    );
  }

  function onSubmit(values: z.infer<typeof updateExerciseInput>) {
    if (!exercise.data) return;
    if (!exercise.data.id) return;

    mutation.mutate({
      ...values,
      id: exercise.data.id,
      description: values.description ?? undefined,
      videoUrl: values.videoUrl ?? undefined,
      secondaryMuscles: values.secondaryMuscles ?? undefined,
      imageUrl: values.imageUrl ?? undefined,
    });
  }

  return (
    <Sidebar>
      <Toaster />
      <FormEditExercise exercise={exercise.data} onSubmit={onSubmit} />
    </Sidebar>
  );
}
