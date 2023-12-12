import { Form } from "#/components/ui/form";
import { trpc } from "#/src/utils/trpc";
import { createExerciseInput } from "@acme/api/src/router/exercises/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
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

interface Props {
  onSubmit(values: z.infer<typeof createExerciseInput>): void;
  form: UseFormReturn<z.infer<typeof createExerciseInput>>;
}

export default function FormAddExercise({ onSubmit }: Props) {
  const muscleGroups = trpc.exercisesRouter.listTargetMuscles.useQuery();
  const exerciseTypes = trpc.exercisesRouter.listExerciseCategories.useQuery();
  const mutation = trpc.exercisesRouter.createExercise.useMutation();

  const form = useForm<z.infer<typeof createExerciseInput>>({
    resolver: zodResolver(createExerciseInput),
    defaultValues: {
      name: "",
      description: "",
      videoUrl: "",
      category: "",
      imageUrl: [],
      primaryMuscle: "",
      secondaryMuscles: [],
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      form.reset();
      toast({
        title: "Cliente creato",
        description: "L'esercizio è stato creato correttamente",
        color: "green",
      });
    } else if (mutation.error) {
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore durante la creazione del cliente, potrebbe essere già presente nel database, ma con un altro trainer",
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

          <SecondaryMusclesSelect form={form} muscleGroups={muscleGroups} />
        </div>
        <Separator className="mb-4" />

        <h2 className="text-lg font-medium text-gray-900">Categoria</h2>
        <ExerciseCategorySelect form={form} types={exerciseTypes.data ?? []} />

        {form.formState.isLoading ? (
          <Button type="submit" disabled>
            Caricamento...
          </Button>
        ) : (
          <Button type="submit">Aggiungi esercizio</Button>
        )}
      </form>
    </Form>
  );
}
