import { Client } from "@acme/db";

import { columns } from "./def";
import { DataTable } from "./dataTable";

interface Props {
  clients: Partial<Client>[];
}

export default function ClientiTable({ clients }: Props) {
  return <DataTable columns={columns} data={clients} />;
}
