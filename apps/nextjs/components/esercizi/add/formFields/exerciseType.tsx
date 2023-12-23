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

interface PrimarytypeSelectProps {
  form: UseFormReturn<z.infer<typeof createExerciseInput>>;
  types: string[];
}

const ExerciseCategorySelect: React.FC<PrimarytypeSelectProps> = ({
  types,
  form,
  form: { control },
}) => {
  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Tipologia di esercizio</FormLabel>
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
                      ? "Seleziona la tipologia di esercizio"
                      : field.value}
                  </span>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search type..." />
                <CommandEmpty>Nessuna tipologia trovata.</CommandEmpty>
                <CommandGroup>
                  {types.map((type) => (
                    <CommandItem
                      value={type}
                      key={type}
                      onSelect={() => {
                        form.setValue("category", type);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === type ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {type}
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

export default ExerciseCategorySelect;
