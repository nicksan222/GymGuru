import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { cn } from "#/lib/utils";
import { AppRouter } from "@acme/api";
import { Exercise } from "@acme/db";
import { inferRouterOutputs } from "@trpc/server";
import Image from "next/image";

type PlanDetails = inferRouterOutputs<AppRouter["plansRouter"]>;

interface Props {
  details:
    | PlanDetails["getPlan"]["WorkoutPlanDay"][0]["WorkoutExercise"][0]
    | undefined;
  exercisesModel?: Exercise;
}

export default function PlanExerciseDetail({ details, exercisesModel }: Props) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row ">
        <div className="my-auto mr-4 h-[80px] w-[80px] flex-shrink-0 justify-center overflow-hidden rounded-lg md:mr-8">
          <div className="relative flex h-full w-full flex-col justify-center">
            <Image
              src={
                exercisesModel?.imageUrl?.split(",")[0] ||
                "https://placehold.co/600x400"
              }
              width={80}
              height={80}
              alt={exercisesModel?.name ?? "No name"}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            {exercisesModel?.name?.toUpperCase() ?? "No name"}
          </h3>
          <p
            className={cn(
              "text-sm",
              details?.description ? "" : "text-gray-600",
            )}
          >
            {details?.description ?? "Nessuna indicazione specifica"}
          </p>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Reps</TableCell>
            <TableCell>Recupero</TableCell>
            <TableCell>Tempo</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details?.WorkoutSet.map((set, index) => (
            <TableRow key={index}>
              <TableCell>{set.reps}</TableCell>
              <TableCell>{set.rest} s</TableCell>
              <TableCell>
                {set.concentric} - {set.hold} - {set.eccentric} s
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
