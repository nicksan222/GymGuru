import React from "react";
import { FieldValues, useFieldArray, UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import * as z from "zod";
import { createExerciseInput } from "@acme/api/src/router/exercises/types";
import { FiDelete } from "react-icons/fi";

interface ExerciseImagesUrlInputProps {
  form: UseFormReturn<z.infer<typeof createExerciseInput>>;
}

type ExerciseImagesFormValues = z.infer<typeof createExerciseInput>["imageUrl"];

const ExerciseImagesUrlInput = ({ form }: ExerciseImagesUrlInputProps) => {
  const { getValues, setValue } = form;

  return (
    <>
      <FormLabel>Immagini</FormLabel>
      <br />

      {getValues().imageUrl.length > 0 && (
        <div className="mt-4">
          {getValues().imageUrl.map((image, index) => {
            return (
              <FormField
                key={index}
                name={`imageUrl.${index}`}
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormControl>
                      <div className="flex w-full flex-row">
                        <Input
                          className="w-full"
                          type="text"
                          name={`imageUrl.${index}`}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <Button
                          className="ml-4"
                          onClick={() =>
                            setValue(
                              "imageUrl",
                              getValues().imageUrl.filter(
                                (_, i) => i !== index,
                              ),
                            )
                          }
                        >
                          <FiDelete />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      )}
      <Button
        type="submit"
        className="mt-4"
        variant="outline"
        onClick={() => setValue("imageUrl", [...getValues().imageUrl, ""])}
      >
        Add Image URL
      </Button>
    </>
  );
};

export default ExerciseImagesUrlInput;
