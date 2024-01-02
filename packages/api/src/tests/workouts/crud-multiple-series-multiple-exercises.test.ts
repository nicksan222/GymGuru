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

const loopUtil = async (
  times: number,
  callback: (currentIndex?: number) => Promise<void> | void,
) => {
  for (let i = 0; i < times; i += 1) await callback(i);
};

describe("Workout start", () => {
  const exercises: string[] = [];

  const numSeries = 3;
  const numExercises = 3;

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

    await loopUtil(numExercises, async () => {
      exercises.push(
        (await createMockExercise(sessions.sessionTrainer.userId)).id,
      );
    });

    // Create plan
    plan = await createMockPlan(
      exercises,
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() + 1)),
      sessions,
      numSeries,
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
    expect(result.length).toBe(numExercises * numSeries);

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

  it("should loop over all the sets and complete them", async () => {
    loopUtil(numExercises, function (numExercise) {
      loopUtil(numSeries, async function (numSerie) {
        try {
          const result = await caller.workoutsRouter.getNextWorkoutExercise();
          expect(result).toBeDefined();
        } catch (error) {
          // If is the last set, we expect an error
          if (numExercise === numExercises - 1 && numSerie === numSeries - 1) {
            return;
          }
        }
      });
    });
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
