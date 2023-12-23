import React, { useCallback } from "react";
import { Button } from "#/components/ui/button";
import { DropdownMenuItem } from "#/components/ui/dropdown-menu";
import { createPlanInput } from "@acme/api/src/router/plans/types";
import { Minus, Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "#/components/ui/drawer";
import * as z from "zod";
import { FiClock } from "react-icons/fi";

interface Props {
  workoutIndex: number;
  exerciseIndex: number;
  seriesIndex: number;
}

interface DrawerEditSectionProps {
  title: string;
  description: string;
  onChange: (value: number) => void;
  currentValue: number;
  maxValue: number;
  minValue: number;
}

function DrawerEditSection({
  title,
  description,
  currentValue,
  maxValue,
  minValue,
  onChange,
}: DrawerEditSectionProps) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        <div className="flex items-center justify-center space-x-2 ">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onChange(-1)}
            disabled={currentValue <= minValue}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <div className="text-7xl font-bold tracking-tighter">
              {currentValue}
            </div>
            <div className="text-muted-foreground text-[0.70rem] uppercase">
              Secondi
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onChange(1)}
            disabled={currentValue >= maxValue}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default function DrawerEditExerciseTimes({
  exerciseIndex,
  seriesIndex,
  workoutIndex,
}: Props) {
  const form = useFormContext<z.infer<typeof createPlanInput>>();
  const currentEccentric = form.watch(
    `workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}.eccentric`,
  );
  const currentConcentric = form.watch(
    `workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}.concentric`,
  );
  const currentHold = form.watch(
    `workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}.hold`,
  );

  const changeValueEccentric = useCallback(
    (increment: number) => {
      const newValue = (currentEccentric || 0) + increment;
      form.setValue(
        `workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}.eccentric`,
        newValue,
        { shouldValidate: true },
      );
    },
    [currentEccentric, form, workoutIndex, exerciseIndex, seriesIndex],
  );

  const changeValueConcentric = useCallback(
    (increment: number) => {
      const newValue = (currentConcentric || 0) + increment;
      form.setValue(
        `workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}.concentric`,
        newValue,
        { shouldValidate: true },
      );
    },
    [currentConcentric, form, workoutIndex, exerciseIndex, seriesIndex],
  );

  const changeValueHold = useCallback(
    (increment: number) => {
      const newValue = (currentHold || 0) + increment;
      form.setValue(
        `workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}.hold`,
        newValue,
        { shouldValidate: true },
      );
    },
    [currentHold, form, workoutIndex, exerciseIndex, seriesIndex],
  );

  const applyToAllSeries = () => {
    const series = form.getValues(
      `workouts.${workoutIndex}.exercises.${exerciseIndex}.series`,
    );
    const newSeries = series?.map((serie) => ({
      ...serie,
      eccentric: currentEccentric,
      concentric: currentConcentric,
      hold: currentHold,
    }));
    form.setValue(
      `workouts.${workoutIndex}.exercises.${exerciseIndex}.series`,
      newSeries,
      { shouldValidate: true },
    );
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="h-8 w-8 p-0">
          <FiClock className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerEditSection
          title="Fase eccentrica"
          description="Mostra il tempo di esecuzione della fase eccentrica"
          currentValue={currentEccentric}
          maxValue={10}
          minValue={1}
          onChange={changeValueEccentric}
        />
        <DrawerEditSection
          title="Fase concentrica"
          description="Mostra il tempo di esecuzione della fase concentrica"
          currentValue={currentConcentric}
          maxValue={10}
          minValue={1}
          onChange={changeValueConcentric}
        />
        <DrawerEditSection
          title="Fase di mantenimento"
          description="Mostra il tempo di esecuzione della fase di mantenimento"
          currentValue={currentHold}
          maxValue={10}
          minValue={0}
          onChange={changeValueHold}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Chiudi</Button>
          </DrawerClose>{" "}
          <DrawerClose asChild>
            <Button onClick={() => applyToAllSeries()} variant="default">
              Chiudi e applica alle altre serie
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
