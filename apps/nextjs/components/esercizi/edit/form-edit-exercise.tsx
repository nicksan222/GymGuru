import { Form } from "#/components/ui/form";
import { trpc } from "#/src/utils/trpc";
import {
  createExerciseInput,
  updateExerciseInput,
} from "@acme/api/src/router/exercises/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ExerciseNameInput from "./formFields.ts/exerciseNameInput";
import ExerciseVideoUrlInput from "./formFields.ts/exerciseVideoUrlInputProps";
import PrimaryMuscleSelect from "./formFields.ts/primaryMuscleSelect";
import SecondaryMusclesSelect from "./formFields.ts/secondaryMuscleSelect";
import ExerciseCategorySelect from "./formFields.ts/exerciseType";
import { Separator } from "#/components/ui/separator";
import ExerciseImagesUrlInput from "./formFields.ts/exerciseImagesUrlInputProps";
import { Button } from "#/components/ui/button";
import { toast } from "#/components/ui/use-toast";
import { Toaster } from "#/components/ui/toaster";
import { useEffect } from "react";
import { Exercise } from "@acme/db";

interface Props {
  onSubmit(values: z.infer<typeof updateExerciseInput>): void;
  exercise: Exercise;
}

export default function FormEditExercise({ onSubmit, exercise }: Props) {
  const muscleGroups = trpc.exercisesRouter.listTargetMuscles.useQuery();
  const exerciseTypes = trpc.exercisesRouter.listExerciseCategories.useQuery();
  const mutation = trpc.exercisesRouter.updateExercise.useMutation();

  const form = useForm<z.infer<typeof updateExerciseInput>>({
    resolver: zodResolver(createExerciseInput),
    defaultValues: {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description ?? undefined,
      videoUrl: exercise.videoUrl ?? undefined,
      category: exercise.category ?? undefined,
      imageUrl: exercise.imageUrl?.split(",") ?? [],
      primaryMuscle: exercise.primaryMuscle ?? undefined,
      secondaryMuscles: exercise.secondaryMuscles ?? [],
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      form.reset();
      toast({
        title: "Esecizio modifcato",
        description: "L'esercizio è stato salvato correttamente",
        color: "green",
      });
    } else if (mutation.error) {
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore durante il salvataggio dell'esercizio",
        color: "red",
      });
    }
  }, [form, mutation.error, mutation.isSuccess]);

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ExerciseNameInput control={form.control} />
        <Separator className="mb-4" />

        <h2 className="text-lg font-medium text-gray-900">Documentazione</h2>
        <div className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-2">
          <div>
            <ExerciseImagesUrlInput form={form} />
          </div>
          <ExerciseVideoUrlInput control={form.control} />
        </div>
        <Separator className="mb-4" />

        <h2 className="text-lg font-medium text-gray-900">Muscoli</h2>
        <div className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-2">
          <PrimaryMuscleSelect
            form={form}
            muscleGroups={muscleGroups.data ?? []}
          />

          <SecondaryMusclesSelect
            form={form}
            muscleGroups={muscleGroups ?? []}
          />
        </div>
        <Separator className="mb-4" />

        <h2 className="text-lg font-medium text-gray-900">Categoria</h2>
        <ExerciseCategorySelect form={form} types={exerciseTypes.data ?? []} />

        {form.formState.isLoading ? (
          <Button type="submit" disabled>
            Caricamento...
          </Button>
        ) : (
          <Button type="submit">Salva esercizio</Button>
        )}
      </form>
    </Form>
  );
}
