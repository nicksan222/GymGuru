import { Exercise } from "@acme/db";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";

import { columns } from "./def";
import { DataTable } from "./dataTable";

interface Props {
  exercises: Exercise[];
}

export default function EserciziTable({ exercises }: Props) {
  return <DataTable columns={columns} data={exercises} />;
}
