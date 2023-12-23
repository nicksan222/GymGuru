import { Client, Exercise } from "@acme/db";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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
import { trpc } from "#/src/utils/trpc";
import { useToast } from "#/components/ui/use-toast";
import ImageCell from "./imageCell";
import ActionsCell from "./actions";

export const columns: ColumnDef<Partial<Client>>[] = [
  {
    accessorKey: "firstName",
    header: "Immagine",
    cell: ({ row }) => {
      return (
        <>
          <ImageCell
            firstName={row.original.firstName ?? ""}
            lastName={row.original.lastName ?? ""}
          />
        </>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cognome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell client={row.original} />;
    },
  },
];
