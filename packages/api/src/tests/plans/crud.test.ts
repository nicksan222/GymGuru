import getMockIdentities from "../utils/getMockIdentities";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import { createMockExercise } from "./utils/createMockExercise";
import { cleanupMockExercise } from "./utils/deleteMockExercise";
import { AsyncReturnType } from "../utils/asyncReturnType";
import { createMockPlan } from "./utils/createMockPlan";

describe("Plan creation", () => {
  const exercises: string[] = [];
  let sessions: AsyncReturnType<typeof getMockIdentities>;
  let caller: AsyncReturnType<typeof getMockTrainerTRPC>;
  let planId: string;

  beforeAll(async () => {
    sessions = await getMockIdentities();
    caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    exercises.push(
      (await createMockExercise(sessions.sessionTrainer.userId)).id,
    );
    exercises.push(
      (await createMockExercise(sessions.sessionTrainer.userId)).id,
    );

    if (!exercises[0] || !exercises[1]) {
      throw new Error("Failed to create mock exercises");
    }
  });

  afterAll(async () => {
    for (const exerciseId of exercises) {
      await cleanupMockExercise(exerciseId);
    }
  });

  it("should create a plan", async () => {
    const exercise = exercises[0] ?? "";

    const result = await caller.plansRouter.createPlan({
      clientId: sessions.recordClient.id,
      endDate: new Date(),
      startDate: new Date(),
      workouts: [
        {
          day: 1,
          exercises: [
            {
              id: exercise,
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
    planId = result?.id ?? "";
  });

  it("should update a plan", async () => {
    const result = await caller.plansRouter.updatePlan({
      planId,
      startDate: new Date(),
    });

    expect(result).toBeDefined();
    expect(result?.id).toBe(planId);
  });

  it("should get a plan", async () => {
    const result = await caller.plansRouter.getPlan({
      planId,
    });

    expect(result).toBeDefined();
    expect(result?.id).toBe(planId);
  });

  it("should delete a plan", async () => {
    const result = await caller.plansRouter.deletePlan({
      planId,
    });

    expect(result).toBeDefined();
    expect(result?.count).toBe(1);
  });
});
