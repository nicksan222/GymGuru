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
import { updateExerciseInput } from "@acme/api/src/router/exercises/types";

interface ExerciseVideoUrlInputProps {
  control: Control<z.infer<typeof updateExerciseInput>>;
}

const ExerciseVideoUrlInput: React.FC<ExerciseVideoUrlInputProps> = ({
  control,
}) => {
  return (
    <FormField
      control={control}
      name="videoUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Video</FormLabel>
          <FormControl>
            <Input
              placeholder="Link al video dell'esercizio"
              type="url"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ExerciseVideoUrlInput;
