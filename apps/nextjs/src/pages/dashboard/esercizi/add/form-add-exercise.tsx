import { Button } from "#/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "#/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import { trpc } from "#/src/utils/trpc";
import { createExerciseInput } from "@acme/api/src/router/exercises/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Props {
  onSubmit(values: z.infer<typeof createExerciseInput>): void;
}

export default function FormAddExercise({ onSubmit }: Props) {
  const muscleGroups = trpc.exercisesRouter.listTargetMuscles.useQuery();

  const form = useForm<z.infer<typeof createExerciseInput>>({
    resolver: zodResolver(createExerciseInput),
    defaultValues: {
      name: "",
      description: "",
      videoUrl: "",
      category: "",
      imageUrl: [],
      primaryMuscles: "",
      secondaryMuscles: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-2">
          <FormField
            control={form.control}
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

          <FormField
            control={form.control}
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

          <FormField
            control={form.control}
            name="primaryMuscles"
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
                      <CommandEmpty>
                        Nessun gruppo muscolare trovato.
                      </CommandEmpty>
                      <CommandGroup>
                        {muscleGroups.data?.map((muscle) => (
                          <CommandItem
                            value={muscle}
                            key={muscle}
                            onSelect={() => {
                              form.setValue("primaryMuscles", muscle);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === muscle
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
                            ? field.value.join(", ")
                            : "Seleziona i muscoli secondari coinvolti"}
                        </span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search muscle..." />
                      <CommandEmpty>
                        Nessun gruppo muscolare trovato.
                      </CommandEmpty>
                      <CommandGroup>
                        {muscleGroups.data?.map((muscle) => (
                          <CommandItem
                            value={muscle}
                            key={muscle}
                            onSelect={() => {
                              if (!field.value?.includes(muscle)) {
                                form.setValue("secondaryMuscles", [
                                  ...(field.value ?? []),
                                  muscle,
                                ]);
                              } else {
                                form.setValue(
                                  "secondaryMuscles",
                                  field.value?.filter((m) => m !== muscle),
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
        </div>
      </form>
    </Form>
  );
}
