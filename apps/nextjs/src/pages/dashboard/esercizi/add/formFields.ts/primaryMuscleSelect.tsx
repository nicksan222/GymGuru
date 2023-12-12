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
import { createExerciseInput } from "@acme/api/src/router/exercises/types";
import { CheckIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface PrimaryMuscleSelectProps {
  form: UseFormReturn<z.infer<typeof createExerciseInput>>;
  muscleGroups: string[];
}

const PrimaryMuscleSelect: React.FC<PrimaryMuscleSelectProps> = ({
  muscleGroups,
  form,
  form: { control },
}) => {
  return (
    <FormField
      control={control}
      name="primaryMuscle"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Gruppo muscolare primario coinvolto</FormLabel>
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
                    {field.value === ""
                      ? "Seleziona il gruppo muscolare primario coinvolto"
                      : field.value}
                  </span>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search muscle..." />
                <CommandEmpty>Nessun gruppo muscolare trovato.</CommandEmpty>
                <CommandGroup>
                  {muscleGroups.map((muscle) => (
                    <CommandItem
                      value={muscle}
                      key={muscle}
                      onSelect={() => {
                        form.setValue("primaryMuscle", muscle);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === muscle ? "opacity-100" : "opacity-0",
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

export default PrimaryMuscleSelect;
