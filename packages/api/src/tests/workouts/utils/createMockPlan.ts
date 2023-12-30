import { Client, WorkoutSet, prisma } from "@acme/db";
import { getMockTrainerTRPC } from "../../utils/getMockTrainerTRPC";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";
import { seriesSchema } from "../../../router/plans/create-types";
import * as z from "zod";

export async function createMockPlan(
  exercisesIds: string[],
  from: Date,
  to: Date,
  sessions: {
    sessionClient: SignedInAuthObject;
    sessionTrainer: SignedInAuthObject;
    recordClient: Client;
  },
  numSeries = 1,
) {
  const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

  const exercises = await prisma.exercise.findMany({
    where: {
      id: {
        in: exercisesIds,
      },
    },
  });

  expect(exercises).toBeDefined();
  expect(exercises.length).toBeGreaterThan(0);

  const client = await prisma.client.findUnique({
    where: {
      id: sessions.recordClient.id,
    },
  });

  expect(client).toBeDefined();
  expect(client?.id).toBe(sessions.recordClient.id);

  const series: z.infer<typeof seriesSchema>[] = [];

  for (let i = 0; i < numSeries; i += 1)
    series.push({
      concentric: 1,
      eccentric: 1,
      hold: 1,
      order: i,
      reps: 1,
      rest: 1,
    });

  const result = await caller.plansRouter.createPlan({
    clientId: client?.id ?? "",
    endDate: to,
    startDate: from,
    workouts: [
      {
        day: 1,
        exercises: exercises.map((exercise) => ({
          id: exercise.id,
          order: 1,
          description: "Test description",
          series: series,
        })),
      },
    ],
  });

  expect(result).toBeDefined();
  expect(result?.id).toBeDefined();

  return await prisma.workoutPlan.findUnique({
    where: {
      id: result?.id ?? "",
    },
    include: {
      WorkoutPlanDay: {
        include: {
          WorkoutExercise: {
            include: {
              WorkoutSet: true,
            },
          },
        },
      },
    },
  });
}
