import { AppRouter } from "@acme/api";
import { Exercise } from "@acme/db";
import { inferRouterOutputs } from "@trpc/server";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type PlanDetails = inferRouterOutputs<AppRouter["plansRouter"]>;

interface Props {
  exercises: PlanDetails["getPlan"]["WorkoutPlanDay"][0]["WorkoutExercise"];
  exercisesModels: Map<string, Exercise>;
}

export default function GraphBodyTargetsFrequencies({
  exercises,
  exercisesModels,
}: Props) {
  const dataMap: Map<string, number> = new Map();

  exercises.forEach((exercise) => {
    const exerciseModel = exercisesModels.get(exercise.exerciseId);

    if (exerciseModel) {
      const primaryMuscle = exerciseModel.primaryMuscle;
      const secondaryMuscles = exerciseModel.secondaryMuscles; // Array of secondary muscles

      // Update count for primary muscle
      if (primaryMuscle) {
        dataMap.set(primaryMuscle, (dataMap.get(primaryMuscle) || 0) + 1);
      }

      // Update count for each secondary muscle
      if (secondaryMuscles && Array.isArray(secondaryMuscles)) {
        secondaryMuscles.forEach((secondaryMuscle) => {
          dataMap.set(
            secondaryMuscle,
            (dataMap.get(secondaryMuscle) || 0) + 0.5,
          );
        });
      }
    }
  });

  // Convert the map to the array format required by recharts
  const data = Array.from(dataMap, ([name, total]) => ({ name, total }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        desc="Serie settimanali (i muscoli primari contano come 1, i secondari come 0.5)"
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
