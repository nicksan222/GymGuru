import { Exercise, Payment } from "@acme/db";
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

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "date",
    header: "Data pagamento",
    cell: ({ row }) => {
      return (
        <p>
          {row.original.date.toLocaleDateString("it-IT", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Pagamento",
    cell: ({ row }) => {
      return <p>{row.original.amount.toFixed(2)} €</p>;
    },
  },
];
