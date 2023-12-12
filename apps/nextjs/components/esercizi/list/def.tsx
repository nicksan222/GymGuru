import { Exercise } from "@acme/db";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { trpc } from "#/src/utils/trpc";
import { useToast } from "#/components/ui/use-toast";

export const columns: ColumnDef<Exercise>[] = [
  {
    accessorKey: "imageUrl",
    header: "Immagine",
    cell: ({ row }) => {
      return (
        <>
          <Image
            src={row.original?.imageUrl?.split(",")[0] ?? ""}
            alt={"Immagine mancante"}
            width={100}
            height={100}
          />
        </>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "primaryMuscle",
    header: "Muscolo primario",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const exercise = row.original;

      const mutation = trpc.exercisesRouter.deleteExercise.useMutation();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Azioni</DropdownMenuLabel>
            <Link href={`/dashboard/esercizi/${exercise.id}`}>
              <DropdownMenuItem>Modifica</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                if (!confirm("Sei sicuro di voler eliminare l'esercizio?"))
                  return;

                const result = await mutation.mutateAsync({
                  id: exercise.id,
                });

                if (result.count === 1) {
                  window.location.reload();
                } else {
                  toast({
                    title: "Errore",
                    description:
                      "Si è verificato un errore durante l'eliminazione dell'esercizio",
                    color: "red",
                  });
                }
              }}
            >
              Elimina
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
