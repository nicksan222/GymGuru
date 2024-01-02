import getMockIdentities from "../utils/getMockIdentities";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { createMockExercise } from "./utils/createMockExercise";
import { cleanupMockExercise } from "./utils/deleteMockExercise";
import { AsyncReturnType } from "../utils/asyncReturnType";
import { createMockPlan } from "./utils/createMockPlan";
import { deleteMockPlan } from "./utils/deleteMockPlan";
import { getMockClientTRPC } from "../utils/getMockClientTRPC";
import { prisma } from "@acme/db";

describe("Plan creation", () => {
  const exercises: string[] = [];
  let sessions: AsyncReturnType<typeof getMockIdentities>;
  let caller: AsyncReturnType<typeof getMockTrainerTRPC>;
  let callerClient: AsyncReturnType<typeof getMockClientTRPC>;
  let planId: string;

  beforeAll(async () => {
    sessions = await getMockIdentities();
    caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);
    callerClient = await getMockClientTRPC(sessions.sessionClient.userId);

    exercises.push(
      (await createMockExercise(sessions.sessionTrainer.userId)).id,
    );
    exercises.push(
      (await createMockExercise(sessions.sessionTrainer.userId)).id,
    );

    if (!exercises[0] || !exercises[1]) {
      throw new Error("Failed to create mock exercises");
    }

    const planCreated = await createMockPlan(
      exercises,
      new Date(),
      new Date(),
      sessions,
    );

    const plan = await prisma.workoutPlan.findUnique({
      where: {
        id: planCreated.id,
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

    if (!plan || !plan.WorkoutPlanDay[0]) throw new Error("Plan not found");

    planId = plan.WorkoutPlanDay[0].id;

    // Setting up the records

    // Starting a mock workout
    const resultStartWorkout = await caller.workoutsRouter.startWorkout({
      workoutId: plan.WorkoutPlanDay[0].id,
    });
    expect(resultStartWorkout.id).toBeDefined();

    if (!plan.WorkoutPlanDay[0]?.WorkoutExercise[0]?.WorkoutSet[0])
      throw new Error("Exercise set not found");

    const resultRecordWorkout =
      await callerClient.workoutsRouter.recordWorkoutSet({
        reps: 1,
        rest: 1,
        setId: plan.WorkoutPlanDay[0]?.WorkoutExercise[0]?.WorkoutSet[0]?.id,
        weight: 1,
      });
    expect(resultRecordWorkout.id).toBeDefined();
  });

  afterAll(async () => {
    const plan = await prisma.workoutPlan.findFirstOrThrow({
      where: {
        WorkoutPlanDay: {
          some: {
            id: planId,
          },
        },
      },
    });

    await deleteMockPlan(plan.id);

    for (const exerciseId of exercises) {
      await cleanupMockExercise(exerciseId);
    }
  });

  it("client should fetch all its own records for a given workout day", async () => {
    const result = await callerClient.plansRouter.getRecordsFroPlanDay({
      planDayId: planId,
    });

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  it("trainer should fetch all the records for a given workout day for a given user", async () => {
    const result = await caller.plansRouter.getRecordsFroPlanDay({
      planDayId: planId,
    });

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });
});
