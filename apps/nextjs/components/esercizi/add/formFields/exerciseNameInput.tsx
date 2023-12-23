import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { z } from "zod";
import { createExerciseInput } from "@acme/api/src/router/exercises/types";

interface ExerciseNameInputProps {
  control: Control<z.infer<typeof createExerciseInput>>;
}

const ExerciseNameInput: React.FC<ExerciseNameInputProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input placeholder="Nome dell'esercizio" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ExerciseNameInput;
