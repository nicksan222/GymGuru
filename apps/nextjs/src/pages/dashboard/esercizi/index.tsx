import ImportEserciziButton from "#/components/esercizi/list/importButton";
import EserciziTable from "#/components/esercizi/list/table";
import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { trpc } from "#/src/utils/trpc";
import { Exercise } from "@acme/db";

export default function ExercisesList() {
  // const targetMuscleGroups = trpc.exercisesRouter.listTargetMuscles.useQuery();
  const exercises = trpc.exercisesRouter.listExercises.useQuery({});

  return (
    <Sidebar>
      <DashboardTitle title="Esercizi" subtitle="Gestisci i tuoi esercizi" />
      <ImportEserciziButton />
      <div className="mt-8" />
      <EserciziTable exercises={(exercises.data ?? []) as Exercise[]} />
    </Sidebar>
  );
}
