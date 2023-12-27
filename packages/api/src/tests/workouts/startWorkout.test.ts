import { Client, WorkoutPlan } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";
import { createMockExercise } from "./utils/createMockExercise";
import { createMockPlan } from "./utils/createMockPlan";
import { cleanupMockExercise } from "./utils/deleteMockExercise";
import { deleteMockPlan } from "./utils/deleteMockPlan";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";
import { getMockClientTRPC } from "../utils/getMockClientTRPC";
import { prisma } from "@acme/db";

describe("Workout start", () => {
  const exercises: string[] = [];
  let plan: WorkoutPlan;
  let sessions: {
    sessionClient: SignedInAuthObject;
    sessionTrainer: SignedInAuthObject;
    recordClient: Client;
  };

  beforeAll(async () => {
    sessions = await getMockIdentities();
    exercises.push(
      (await createMockExercise(sessions.sessionTrainer.userId)).id,
    );
    exercises.push(
      (await createMockExercise(sessions.sessionTrainer.userId)).id,
    );
    exercises.push(
      (await createMockExercise(sessions.sessionTrainer.userId)).id,
    );

    // Create plan
    plan = await createMockPlan(
      exercises,
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() + 1)),
      sessions,
    );
  });

  afterAll(async () => {
    await deleteMockPlan(plan.id);

    for (const exerciseId of exercises) {
      await cleanupMockExercise(exerciseId);
    }
  });

  it("should start a workout", async () => {
    const caller = await getMockClientTRPC(
      sessions.sessionClient.userId,
      sessions.sessionClient.user?.emailAddresses[0]?.emailAddress,
    );

    // Getting the first day of the workout plan
    const workoutPlanDay = await prisma.workoutPlanDay.findFirst({
      where: {
        workoutPlanId: plan.id,
      },
    });

    expect(workoutPlanDay).toBeDefined();
    expect(workoutPlanDay?.id).toBeDefined();

    const result = await caller.workoutsRouter.startWorkout({
      workoutId: workoutPlanDay?.id ?? "",
    });

    expect(result).toBeDefined();
    expect(result?.workoutPlanDayId).toBe(workoutPlanDay?.id);
  });
});
