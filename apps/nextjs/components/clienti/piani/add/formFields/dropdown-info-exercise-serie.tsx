import React from "react";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { createPlanInput } from "@acme/api/src/router/plans/types";
import { MoreHorizontal } from "lucide-react";
import { useFormContext } from "react-hook-form";
import * as z from "zod";

interface Props {
  workoutIndex: number;
  exerciseIndex: number;
  seriesIndex: number;
}

function DropdownEditExerciseSerie({
  workoutIndex,
  exerciseIndex,
  seriesIndex,
}: Props) {
  const form = useFormContext<z.infer<typeof createPlanInput>>();
  const serie = form.watch(
    `workouts.${workoutIndex}.exercises.${exerciseIndex}.series.${seriesIndex}`,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Informazioni</DropdownMenuLabel>
        <SerieInfo label="Durata eccentrica" value={serie?.eccentric} />
        <SerieInfo label="Durata concentrica" value={serie?.concentric} />
        <SerieInfo label="Durata isometrica" value={serie?.hold} />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Azioni</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SerieInfo({ label, value }: { label: string; value?: number }) {
  return (
    <DropdownMenuItem>
      <span className="flex items-center space-x-2">
        <span>{label}</span>
        <span className="text-gray-500">{value}</span>
      </span>
    </DropdownMenuItem>
  );
}

export default DropdownEditExerciseSerie;
