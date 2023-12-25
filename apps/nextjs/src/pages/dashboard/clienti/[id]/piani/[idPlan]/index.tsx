import PianoDetail from "#/components/clienti/piani/detail/piano-detail";
import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { trpc } from "#/src/utils/trpc";
import { Exercise } from "@acme/db";
import { useRouter } from "next/router";

export default function ClientiView() {
  const router = useRouter();
  const planId = router.query.idPlan;

  const planDetails = trpc.plansRouter.getPlan.useQuery({
    planId: planId?.toString() ?? "",
  });

  const exercisesFetched = trpc.exercisesRouter.listExercises.useQuery(
    {
      filterIds:
        planDetails.data?.days
          .map((day) => day.exercises.map((e) => e.exerciseId))
          .flat() ?? [],
    },
    {
      enabled: !!planDetails.data,
    },
  );

  const getExercisesModels = () => {
    const exercisesModels: Map<string, Exercise> = new Map();
    exercisesFetched.data?.forEach((exercise) => {
      exercisesModels.set(exercise.id, exercise as Exercise);
    });
    return exercisesModels;
  };

  return (
    <Sidebar>
      <DashboardTitle
        title="Dettagli piano"
        subtitle={
          "Valido dal " +
          planDetails.data?.plan?.startDate.toISOString().split("T")[0] +
          " al " +
          planDetails.data?.plan?.endDate.toISOString().split("T")[0]
        }
      />
      <PianoDetail
        plan={planDetails.data?.plan}
        days={planDetails.data?.days ?? []}
        exercises={getExercisesModels()}
      />
    </Sidebar>
  );
}
