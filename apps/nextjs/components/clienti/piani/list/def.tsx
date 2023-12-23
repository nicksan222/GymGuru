import { Client, Exercise, WorkoutPlan } from "@acme/db";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "#/components/ui/button";
import ImageCell from "./imageCell";
import ActionsCell from "./actions";
import { Badge } from "#/components/ui/badge";
import Link from "next/link";

interface Props {
  cliente: Partial<Client>;
  workoutPlan: Partial<WorkoutPlan>;
}

function isActive(workoutPlan: Partial<WorkoutPlan>) {
  const today = new Date();
  const startDate = workoutPlan.startDate;
  const endDate = workoutPlan.endDate;

  if (startDate && endDate) {
    return today >= startDate && today <= endDate;
  }

  return false;
}

export const columns: ColumnDef<Props>[] = [
  {
    accessorKey: "cliente",
    header: "Immagine",
    cell: ({ row }) => {
      return (
        <>
          <ImageCell
            firstName={row.original.cliente.firstName ?? ""}
            lastName={row.original.cliente.lastName ?? ""}
          />
        </>
      );
    },
  },
  {
    accessorKey: "workoutPlan",
    header: "Data inizio",
    cell: ({ row }) => {
      return (
        <>
          <span>
            {row.original.workoutPlan.startDate?.toISOString().split("T")[0]}
          </span>
        </>
      );
    },
  },
  {
    accessorKey: "workoutPlan",
    header: "Data fine",
    cell: ({ row }) => {
      return (
        <>
          <span>
            {row.original.workoutPlan.endDate?.toISOString().split("T")[0]}
          </span>
        </>
      );
    },
  },
  {
    accessorKey: "Attivo",
    header: "Attivo",
    cell: ({ row }) => {
      return (
        <>
          <span>
            {isActive(row.original.workoutPlan) ? (
              <Badge color="green">Attivo</Badge>
            ) : (
              <Badge color="red">Non attivo</Badge>
            )}
          </span>
        </>
      );
    },
  },
  {
    accessorKey: "Dettagli",
    header: "Dettagli",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/clienti/${row.original.cliente.id}/piani/${row.original.workoutPlan.id}`}
        >
          <Button variant="secondary">Dettagli</Button>
        </Link>
      );
    },
  },
];
