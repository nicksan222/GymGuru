import { Client, WorkoutSet } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";
import { createMockExercise } from "./utils/createMockExercise";
import { createMockPlan } from "./utils/createMockPlan";
import { cleanupMockExercise } from "./utils/deleteMockExercise";
import { deleteMockPlan } from "./utils/deleteMockPlan";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";
import { getMockClientTRPC } from "../utils/getMockClientTRPC";
import { prisma } from "@acme/db";
import { AsyncReturnType } from "../utils/asyncReturnType";

describe("Workout start", () => {
  const exercises: string[] = [];
  let plan: AsyncReturnType<typeof createMockPlan>;
  let sessions: {
    sessionClient: SignedInAuthObject;
    sessionTrainer: SignedInAuthObject;
    recordClient: Client;
  };
  let caller: AsyncReturnType<typeof getMockClientTRPC>;
  let workoutPlanDayId: string;
  let workoutSets: WorkoutSet[];

  beforeAll(async () => {
    sessions = await getMockIdentities();
    caller = await getMockClientTRPC(
      sessions.sessionClient.userId,
      sessions.sessionClient.user?.emailAddresses[0]?.emailAddress,
    );

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

    const result = await prisma.workoutSet.findMany({
      where: {
        WorkoutExercise: {
          Exercise: {
            id: {
              in: exercises,
            },
          },
        },
      },
    });

    expect(result).toBeDefined();
    expect(result.length).toBe(3);

    workoutSets = result;
  });

  afterAll(async () => {
    if (!plan) return;
    await deleteMockPlan(plan.id);

    for (const exerciseId of exercises) {
      await cleanupMockExercise(exerciseId);
    }
  });

  it("should start a workout", async () => {
    // Getting the first day of the workout plan
    const workoutPlanDay = await prisma.workoutPlanDay.findFirst({
      where: {
        workoutPlanId: plan?.id,
      },
    });

    expect(workoutPlanDay).toBeDefined();
    expect(workoutPlanDay?.id).toBeDefined();

    const result = await caller.workoutsRouter.startWorkout({
      workoutId: workoutPlanDay?.id ?? "",
    });

    expect(result).toBeDefined();
    expect(result?.workoutPlanDayId).toBe(workoutPlanDay?.id);
    expect(result?.completedAt).toBeNull();

    workoutPlanDayId = workoutPlanDay?.id ?? "";
  });

  it("should get the first workout set", async () => {
    const result = await caller.workoutsRouter.getNextWorkoutExercise();

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    expect(result?.id).toBe(workoutSets[0]?.id);
  });

  it("should create the first workout set record", async () => {
    const result = await caller.workoutsRouter.recordWorkoutSet({
      reps: 1,
      rest: 2,
      setId:
        plan?.WorkoutPlanDay[0]?.WorkoutExercise[0]?.WorkoutSet[0]?.id ?? "",
      weight: 1,
    });

    expect(result.id).toBeDefined();
  });

  it("should get the second workout set", async () => {
    const result = await caller.workoutsRouter.getNextWorkoutExercise();

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    expect(result?.id).toBe(workoutSets[1]?.id);
  });

  it("should create the second workout set record", async () => {
    const result = await caller.workoutsRouter.recordWorkoutSet({
      reps: 1,
      rest: 2,
      setId:
        plan?.WorkoutPlanDay[0]?.WorkoutExercise[1]?.WorkoutSet[0]?.id ?? "",
      weight: 1,
    });

    expect(result.id).toBeDefined();
  });

  it("should get the third workout set", async () => {
    const result = await caller.workoutsRouter.getNextWorkoutExercise();

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    expect(result?.id).toBe(workoutSets[2]?.id);
  });

  it("should create the third workout set record", async () => {
    const result = await caller.workoutsRouter.recordWorkoutSet({
      reps: 1,
      rest: 2,
      setId:
        plan?.WorkoutPlanDay[0]?.WorkoutExercise[2]?.WorkoutSet[0]?.id ?? "",
      weight: 1,
    });

    expect(result.id).toBeDefined();
  });

  it("should not get the next workout set", async () => {
    try {
      await caller.workoutsRouter.getNextWorkoutExercise();
      fail("Should have thrown an error");
    } catch (error) {
      if (typeof error === "undefined") fail("Should have thrown an error");
    }
  });

  it("should end the workout", async () => {
    const result = await caller.workoutsRouter.endWorkout({
      workoutPlanDayId,
    });

    expect(result).toBeDefined();
    expect(result?.completedAt).toBeDefined();
  });
});
