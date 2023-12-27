import React from "react";
import PianoDetail from "#/components/clienti/piani/detail/piano-detail";
import DashboardTitle from "#/components/header/title";
import { Sidebar } from "#/components/sidebar";
import { trpc } from "#/src/utils/trpc";
import { useRouter } from "next/router";
import { Exercise } from "@acme/db";

const ClientiView = () => {
  const router = useRouter();
  const planId = router.query.idPlan as string;

  const {
    data: planDetails,
    isLoading: isPlanDetailsLoading,
    isError: isPlanDetailsError,
  } = trpc.plansRouter.getPlan.useQuery({
    planId: planId ?? "",
  });

  const {
    data: exercisesFetched,
    isLoading: isExercisesLoading,
    isError: isExercisesError,
  } = trpc.exercisesRouter.listExercises.useQuery(
    {
      filterIds:
        planDetails?.WorkoutPlanDay.flatMap((day) =>
          day.WorkoutExercise.map((e) => e.exerciseId),
        ) ?? [],
    },
    {
      enabled: !!planDetails,
    },
  );

  const getExercisesModels = () => {
    const exercisesModels = new Map<string, Exercise>();
    exercisesFetched?.forEach((exercise) => {
      exercisesModels.set(exercise.id, exercise as Exercise);
    });
    return exercisesModels;
  };

  if (isPlanDetailsLoading || isExercisesLoading) {
    return (
      <Sidebar>
        <DashboardTitle title="Caricamento..." />
      </Sidebar>
    );
  }
  if (isPlanDetailsError || isExercisesError)
    return <div>Error loading data</div>;

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return (
    <Sidebar>
      <DashboardTitle
        title="Dettagli piano"
        subtitle={`Valido dal ${formatDate(
          planDetails?.startDate,
        )} al ${formatDate(planDetails?.endDate)}`}
      />
      {planDetails && (
        <PianoDetail
          plan={planDetails}
          days={planDetails.WorkoutPlanDay}
          exercises={getExercisesModels()}
        />
      )}
    </Sidebar>
  );
};

export default ClientiView;
