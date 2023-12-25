import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { trpc } from "#/src/utils/trpc";
import { createPlanInput } from "@acme/api/src/router/plans/types";
import { Exercise } from "@acme/db";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import { DialogClose } from "@radix-ui/react-dialog";
import { ScrollArea } from "#/components/ui/scroll-area";

interface Props {
  form: UseFormReturn<z.infer<typeof createPlanInput>>;
  workoutIndex: number;
}

export function PlanDayAddExerciseDialog({ form, workoutIndex }: Props) {
  const exercises = trpc.exercisesRouter.listExercises.useQuery({});
  const [filterText, setFilterText] = useState("");
  const exercisesByCategoryRef = useRef<Record<string, Partial<Exercise>[]>>(
    {},
  );
  const [filteredExercises, setFilteredExercises] = useState<
    Record<string, Partial<Exercise>[]>
  >({});

  const { append, fields } = useFieldArray({
    control: form.control,
    name: `workouts.${workoutIndex}.exercises`,
  });

  useEffect(() => {
    if (exercises.data) {
      const categorizedExercises = exercises.data.reduce((acc, exercise) => {
        const category = exercise.category || "Other"; // Handle exercises without a category
        acc[category] = acc[category] || [];
        acc[category]?.push(exercise);
        return acc;
      }, {} as Record<string, Partial<Exercise>[]>);
      exercisesByCategoryRef.current = categorizedExercises;
      filterExercises(categorizedExercises, filterText);
    }
  }, [exercises.data, filterText]);

  const addExercise = (exercise: Partial<Exercise>) => {
    if (!exercise.id || !exercise.name) {
      return;
    }

    // Calculate the maximum order value from the existing exercises
    const maxOrder = fields.reduce(
      (max, field) => Math.max(max, field.order || 0),
      0,
    );

    append({
      id: exercise.id,
      order: maxOrder + 1,
      series: [],
    });
  };

  const filterExercises = (
    exercises: Record<string, Partial<Exercise>[]>,
    filter: string,
  ) => {
    const filtered = Object.keys(exercises).reduce((acc, category) => {
      acc[category] = (exercises[category] ?? []).filter(
        (exercise) =>
          filter.length === 0 ||
          exercise?.name?.toLowerCase().includes(filter.toLowerCase()),
      );
      return acc;
    }, {} as Record<string, Partial<Exercise>[]>);
    setFilteredExercises(filtered);
  };

  if (exercises.data === undefined) {
    return <Button disabled>Caricamento...</Button>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Aggiungi esercizio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <ScrollArea className="h-[450px] rounded-md border p-4">
          <DialogHeader>
            <DialogTitle>Aggiungi esercizio</DialogTitle>
            <DialogDescription>
              <Input
                placeholder="Cerca esercizio"
                className="mt-4"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(filteredExercises).map(([category, exercises]) => (
              <div key={category}>
                <h3 className="my-2">{category}</h3>
                {exercises.map((exercise) => (
                  <DialogClose key={exercise.id} className="w-full">
                    <div
                      className="cursor-pointer rounded-md border-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => addExercise(exercise)}
                    >
                      {exercise.name}
                    </div>
                  </DialogClose>
                ))}
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default PlanDayAddExerciseDialog;
