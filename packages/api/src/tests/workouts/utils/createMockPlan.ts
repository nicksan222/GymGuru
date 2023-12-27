import { Client, prisma } from "@acme/db";
import { getMockTrainerTRPC } from "../../utils/getMockTrainerTRPC";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";

export async function createMockPlan(
  exercisesIds: string[],
  from: Date,
  to: Date,
  sessions: {
    sessionClient: SignedInAuthObject;
    sessionTrainer: SignedInAuthObject;
    recordClient: Client;
  },
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
          series: [
            {
              concentric: 1,
              eccentric: 1,
              hold: 1,
              order: 1,
              reps: 1,
              rest: 1,
            },
          ],
        })),
      },
    ],
  });

  expect(result).toBeDefined();
  expect(result?.id).toBeDefined();

  return result;
}
