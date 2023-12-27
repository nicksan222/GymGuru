import getMockIdentities from "../utils/getMockIdentities";
import { createMockExercise } from "./utils/createMockExercise";
import { cleanupMockExercise } from "./utils/deleteMockExercise";
import { createMockPlan } from "./utils/createMockPlan";
import { deleteMockPlan } from "./utils/deleteMockPlan";
import { getMockClientTRPC } from "../utils/getMockClientTRPC";
import { TRPCError } from "@trpc/server";

describe("Get active plan", () => {
  const exercises: string[] = [];
  const plansIds: string[] = [];

  beforeAll(async () => {
    const sessions = await getMockIdentities();

    for (let i = 0; i < 3; i++) {
      const exercise = await createMockExercise(sessions.sessionTrainer.userId);
      exercises.push(exercise.id);
    }

    for (let i = 0; i < 3; i++) {
      const plan = await createMockPlan(
        [exercises[i] ?? ""],
        new Date(new Date().setMonth(new Date().getMonth() + i - 1)),
        new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
        sessions,
      );
      plansIds.push(plan.id);
    }
  });

  afterAll(async () => {
    for (const planId of plansIds) {
      await deleteMockPlan(planId);
    }

    for (const exerciseId of exercises) {
      await cleanupMockExercise(exerciseId);
    }
  });

  it("should get active plan", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockClientTRPC(
      sessions.sessionClient.userId,
      sessions.sessionClient.user?.emailAddresses[0]?.emailAddress,
    );

    const result = await caller.plansRouter.getActivePlan();
    expect(result).toBeDefined();

    expect(result?.plan?.id).toBe(plansIds[0]);
  });

  it("should not get active plan if no plans are active for this user", async () => {
    const caller = await getMockClientTRPC("a");

    try {
      await caller.plansRouter.getActivePlan();
      fail("Should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError);
    }
  });
});
