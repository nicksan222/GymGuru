// Imports from external libraries
import { MuscleTarget, prisma, Client, Exercise, WorkoutPlan } from "@acme/db";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { AsyncReturnType } from "../utils/asyncReturnType";
import getMockIdentities from "../utils/getMockIdentities";
import { getMockClientTRPC } from "../utils/getMockClientTRPC";

/**
 * Creates a mock exercise.
 * @param trainerId The ID of the trainer.
 * @returns The created Exercise object.
 */
export async function createMockExercise(trainerId: string): Promise<Exercise> {
  return prisma.exercise.create({
    data: {
      name: "Test Exercise",
      category: "Test Category",
      primaryMuscle: MuscleTarget.Abduttori,
      secondaryMuscles: "",
      trainerId,
    },
  });
}

/**
 * Creates a mock plan.
 * @param exercisesIds Array of exercise IDs.
 * @param from Starting date.
 * @param to Ending date.
 * @param sessions Session information.
 * @returns The created WorkoutPlan object.
 */
export async function createMockPlan(
  exercisesIds: string[],
  from: Date,
  to: Date,
  sessions: {
    sessionClient: SignedInAuthObject;
    sessionTrainer: SignedInAuthObject;
    recordClient: Client;
  },
): Promise<WorkoutPlan> {
  const callerTrainer = await getMockTrainerTRPC(
    sessions.sessionTrainer.userId,
  );
  const exercises = await prisma.exercise.findMany({
    where: { id: { in: exercisesIds } },
  });
  expect(exercises).toBeDefined();
  expect(exercises.length).toBeGreaterThan(0);

  const client = await prisma.client.findUnique({
    where: { id: sessions.recordClient.id },
  });
  expect(client).toBeDefined();
  expect(client?.id).toBe(sessions.recordClient.id);

  return callerTrainer.plansRouter.createPlan({
    clientId: client?.id ?? "",
    endDate: to,
    startDate: from,
    workouts: exercises.map((exercise) => ({
      day: 1,
      exercises: [
        {
          ...exercise,
          order: 1,
          category: "",
          trainerId: sessions.sessionTrainer.userId,
          description: undefined,
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
    })),
  });
}

/**
 * Cleans up a mock exercise.
 * @param exerciseId The ID of the exercise to delete.
 */
export async function cleanupMockExercise(exerciseId: string): Promise<void> {
  await prisma.exercise.delete({ where: { id: exerciseId } });
}

/**
 * Deletes a mock plan.
 * @param planId The ID of the plan to delete.
 */
export async function deleteMockPlan(planId: string): Promise<void> {
  const plan = await prisma.workoutPlan.findUnique({ where: { id: planId } });
  expect(plan).toBeDefined();

  await prisma.workoutSet.deleteMany({
    where: { WorkoutExercise: { WorkoutPlanDay: { workoutPlanId: planId } } },
  });
  await prisma.workoutExercise.deleteMany({
    where: { WorkoutPlanDay: { workoutPlanId: planId } },
  });
  await prisma.workoutPlanDay.deleteMany({ where: { workoutPlanId: planId } });
  await prisma.workoutPlan.delete({ where: { id: planId } });
}

/**
 * Test suite for getting active plans.
 */
describe("Get active plan", () => {
  let exercises: string[] = [];
  const plansIds: string[] = [];
  let sessions: AsyncReturnType<typeof getMockIdentities>;
  let callerTrainer: AsyncReturnType<typeof getMockTrainerTRPC>;
  let callerClient: AsyncReturnType<typeof getMockClientTRPC>;

  beforeAll(async () => {
    sessions = await getMockIdentities();
    callerTrainer = await getMockTrainerTRPC(sessions.sessionTrainer.userId);
    callerClient = await getMockClientTRPC(sessions.sessionClient.userId);

    exercises = await Promise.all(
      Array.from({ length: 3 }, () =>
        createMockExercise(sessions.sessionTrainer.userId),
      ),
    ).then((results) => results.map((exercise) => exercise.id));

    const result = await createMockPlan(
      exercises,
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      new Date(new Date().setMonth(new Date().getMonth() + 1)),
      sessions,
    );

    plansIds.push(result.id);
  });

  afterAll(async () => {
    await Promise.all(plansIds.map(deleteMockPlan));
    await Promise.all(exercises.map(cleanupMockExercise));
  });

  it("trainer should be able to retrieve its own client active plan", async () => {
    const result = await callerTrainer.plansRouter.getActivePlan({
      clientId: sessions.recordClient.id,
    });
    expect(result).toBeDefined();
    expect(plansIds).toContain(result.plan.id);
  });

  it("user should be able to retrieve its own active plan", async () => {
    const result = await callerClient.plansRouter.getActivePlan();
    expect(result).toBeDefined();
    expect(plansIds).toContain(result.plan.id);
  });
});
