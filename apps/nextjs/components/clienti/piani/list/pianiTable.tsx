import { Client, WorkoutPlan } from "@acme/db";

import { columns } from "./def";
import { DataTable } from "./dataTable";
import { trpc } from "#/src/utils/trpc";

interface Props {
  piani: Partial<WorkoutPlan>[];
  cliente: Client;
}

export default function PianiTable({ piani, cliente }: Props) {
  return (
    <DataTable
      columns={columns}
      data={
        piani.map((piano) => {
          return {
            cliente,
            workoutPlan: piano,
          };
        }) ?? []
      }
    />
  );
}
