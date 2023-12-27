import { Payment } from "@acme/db";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "workoutPlanId",
    header: "Piano creato il",
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
