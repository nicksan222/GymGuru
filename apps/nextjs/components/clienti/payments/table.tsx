import { Payment } from "@acme/db";

import { columns } from "./def";
import { DataTable } from "./dataTable";

interface Props {
  payments: Payment[];
}

export default function PaymentsTable({ payments }: Props) {
  return <DataTable columns={columns} data={payments} />;
}
