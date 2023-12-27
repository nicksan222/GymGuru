import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { trpc } from "#/src/utils/trpc";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { Calendar } from "#/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Separator } from "#/components/ui/separator";
import { useEffect } from "react";
import { useToast } from "#/components/ui/use-toast";
import { Toaster } from "#/components/ui/toaster";
import { createClientInput } from "@acme/api/src/router/clients/types";

export default function ClientiAdd() {
  const mutation = trpc.clientRouter.createClient.useMutation();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createClientInput>>({
    resolver: zodResolver(createClientInput),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: new Date(),
      medicalHistory: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createClientInput>) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      form.reset();
      toast({
        title: "Cliente creato",
        description: "Il cliente è stato creato correttamente",
        color: "green",
      });
    } else if (mutation.error) {
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore durante la creazione del cliente, potrebbe essere già presente nel database, ma con un altro trainer",
        color: "red",
      });
    }
  }, [form, mutation.error, mutation.isSuccess, toast]);

  return (
    <Sidebar>
      <Toaster />
      <DashboardTitle title="Nuovo cliente" subtitle="Aggiungi un cliente" />
      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cognome</FormLabel>
                  <FormControl>
                    <Input placeholder="Cognome del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email del cliente"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Telefono del cliente"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storia medica</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Storia medica del cliente"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-6" />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className=" flex flex-col">
                <FormLabel>Data di nascita</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <p>Scegli una data</p>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-6" />
          {form.formState.isLoading ? (
            <Button type="submit" disabled>
              Caricamento...
            </Button>
          ) : (
            <Button type="submit">Aggiungi cliente</Button>
          )}
        </form>
      </Form>
    </Sidebar>
  );
}
