import getMockIdentities from "../utils/getMockIdentities";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import { createMockExercise } from "./utils/createMockExercise";
import { cleanupMockExercise } from "./utils/deleteMockExercise";

async function cleanupMockPlan(planId: string) {
  const resultDeletePlanSets = await prisma.workoutSet.deleteMany({
    where: {
      WorkoutExercise: {
        WorkoutPlanDay: {
          workoutPlanId: planId,
        },
      },
    },
  });

  expect(resultDeletePlanSets).toBeDefined();

  const resultDeletePlanExercises = await prisma.workoutExercise.deleteMany({
    where: {
      WorkoutPlanDay: {
        workoutPlanId: planId,
      },
    },
  });

  expect(resultDeletePlanExercises).toBeDefined();

  const resultDeletePlan = await prisma.workoutPlanDay.deleteMany({
    where: {
      workoutPlanId: planId,
    },
  });

  expect(resultDeletePlan).toBeDefined();

  const result = await prisma.workoutPlan.delete({
    where: {
      id: planId,
    },
  });

  expect(result).toBeDefined();
  expect(result?.id).toBe(planId);
}

describe("Plan creation", () => {
  const exercises: string[] = [];

  afterAll(async () => {
    for (const exerciseId of exercises) {
      await cleanupMockExercise(exerciseId);
    }
  });

  it("should create a plan", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    const exercise = await createMockExercise(sessions.sessionTrainer.userId);
    exercises.push(exercise.id);

    const result = await caller.plansRouter.createPlan({
      clientId: sessions.recordClient.id,
      endDate: new Date(),
      startDate: new Date(),
      workouts: [
        {
          day: 1,
          exercises: [
            {
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
            },
          ],
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    if (result?.id) await cleanupMockPlan(result.id);
  });
});
