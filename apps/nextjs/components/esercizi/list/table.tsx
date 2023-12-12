import { Exercise } from "@acme/db";

import { columns } from "./def";
import { DataTable } from "./dataTable";

interface Props {
  exercises: Exercise[];
}

export default function EserciziTable({ exercises }: Props) {
  return <DataTable columns={columns} data={exercises} />;
}
