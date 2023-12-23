import React from "react";
import { Button } from "#/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { createPlanInput } from "@acme/api/src/router/plans/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import * as z from "zod";
import DropdownEditExerciseSerie from "./dropdown-info-exercise-serie";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { DeleteIcon } from "lucide-react";
import { FiDelete } from "react-icons/fi";
import DrawerEditExerciseTimes from "./drawer-edit-exercise-times";

interface SeriesInputProps {
  workoutIndex: number;
  exerciseIndex: number;
  seriesIndex: number;
}

const SeriesInput: React.FC<SeriesInputProps> = ({
  workoutIndex,
  exerciseIndex,
  seriesIndex,
}) => {
  const { control } = useFormContext<z.infer<typeof createPlanInput>>();
  const { remove } = useFieldArray({
    control: control,
    name: `workouts.${workoutIndex}.exercises.${exerciseIndex}.series`,
  });

  return (
    <>
      <TableCell>
        <FormField
          control={control}
          name={`workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}.reps`}
          render={({ field }) => (
            <>
              <Input {...field} aria-label="Reps" type="number" />
              <FormDescription className="ml-2 mt-2">
                Ripetizioni
              </FormDescription>
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={control}
          name={`workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}.rest`}
          render={({ field }) => (
            <>
              <Input {...field} aria-label="Rest" type="number" />
              <FormDescription className="ml-2 mt-2">
                Recupero (s)
              </FormDescription>
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <DropdownEditExerciseSerie
          workoutIndex={workoutIndex}
          exerciseIndex={exerciseIndex}
          seriesIndex={seriesIndex}
        />
      </TableCell>
      <TableCell>
        <DrawerEditExerciseTimes
          {...{ workoutIndex, exerciseIndex, seriesIndex }}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="secondary"
          className="h-8 w-8 bg-red-500 p-0 text-white"
          onClick={() => {
            remove(seriesIndex);
          }}
        >
          <span className="sr-only">Open menu</span>
          <FiDelete className="h-4 w-4" />
        </Button>
      </TableCell>
    </>
  );
};

interface PlanDayExerciseFormProps {
  workoutIndex: number;
  exerciseIndex: number;
  exerciseName?: string;
}

const PlanDayExerciseForm: React.FC<PlanDayExerciseFormProps> = ({
  workoutIndex,
  exerciseIndex,
  exerciseName,
}) => {
  const form = useFormContext<z.infer<typeof createPlanInput>>();
  const { watch } = form;
  const series = watch(
    `workouts.${workoutIndex}.exercises.${exerciseIndex}.series`,
  );
  const { append } = useFieldArray({
    control: form.control,
    name: `workouts.${workoutIndex}.exercises.${exerciseIndex}.series`,
  });

  const addNewSeries = () => {
    const defaultValues = {
      reps: 10,
      concentric: 2,
      eccentric: 2,
      hold: 2,
      rest: 120,
    };

    const lastSeries =
      series && (series?.length ?? 0) > 0
        ? series[series.length - 1]
        : defaultValues;

    append({
      order: (series?.length ?? 0) + 1,
      ...(lastSeries ?? defaultValues),
    });
  };

  return (
    <div>
      <div className=" space-x-4 ">
        <Form {...form}>
          <Table className="my-4 w-full">
            <TableHeader className=" text-lg font-semibold">
              <h2 className="pl-4">{exerciseName}</h2>
            </TableHeader>
            <TableBody>
              {series?.map((serie, index) => (
                <FormItem key={serie.order}>
                  <FormControl>
                    <TableRow>
                      <SeriesInput
                        workoutIndex={workoutIndex}
                        exerciseIndex={exerciseIndex}
                        seriesIndex={index}
                      />
                    </TableRow>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addNewSeries} type="button" variant="outline">
            Aggiungi serie
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PlanDayExerciseForm;
