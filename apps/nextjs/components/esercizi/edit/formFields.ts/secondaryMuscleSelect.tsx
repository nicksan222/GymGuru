import { Button } from "#/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "#/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import { updateExerciseInput } from "@acme/api/src/router/exercises/types";
import { CheckIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface SecondaryMusclesSelectProps {
  form: UseFormReturn<z.infer<typeof updateExerciseInput>>;
  muscleGroups: {
    data: string[] | undefined;
  };
}

const SecondaryMusclesSelect = ({
  form,
  muscleGroups,
}: SecondaryMusclesSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="secondaryMuscles"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Gruppi muscolari secondari coinvolti</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[400px] justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <span>
                    {field.value?.length
                      ? field.value
                      : "Seleziona i muscoli secondari coinvolti"}
                  </span>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search muscle..." />
                <CommandEmpty>Nessun gruppo muscolare trovato.</CommandEmpty>
                <CommandGroup>
                  {muscleGroups.data?.map((muscle) => (
                    <CommandItem
                      value={muscle}
                      key={muscle}
                      onSelect={() => {
                        if (!field.value?.includes(muscle)) {
                          form.setValue(
                            "secondaryMuscles",
                            [...(field.value ?? []), muscle].join(", "),
                          );
                        } else {
                          form.setValue(
                            "secondaryMuscles",
                            (field.value ?? [])
                              .split(",")
                              .filter((m) => m !== muscle)
                              .join(", "),
                          );
                        }
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value?.includes(muscle)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {muscle}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SecondaryMusclesSelect;
