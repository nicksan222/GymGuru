import getMockIdentities from "../utils/getMockIdentities";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { MuscleTarget, prisma, Exercise } from "@acme/db";
import { AsyncReturnType } from "../utils/asyncReturnType";

/**
 * Helper function to create a mock exercise.
 * @param {string} trainerId - The ID of the trainer creating the exercise.
 * @returns {Promise<Exercise>} The created exercise.
 */
async function createMockExercise(trainerId: string): Promise<Exercise> {
  return prisma.exercise.create({
    data: {
      name: "Test Exercise",
      category: "Test Category",
      primaryMuscle: MuscleTarget.Abduttori,
      trainerId,
      secondaryMuscles: "",
    },
  });
}

/**
 * Helper function to clean up a mock exercise.
 * @param {string} exerciseId - The ID of the exercise to be deleted.
 * @returns {Promise<void>}
 */
async function cleanupMockExercise(exerciseId: string): Promise<void> {
  await prisma.exercise.delete({ where: { id: exerciseId } });
}

describe("Plan creation and management", () => {
  let sessions: AsyncReturnType<typeof getMockIdentities>;
  let caller: AsyncReturnType<typeof getMockTrainerTRPC>;
  let planId: string;
  let exercises: string[] = [];

  beforeAll(async () => {
    sessions = await getMockIdentities();
    caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);
    exercises = await Promise.all([
      createMockExercise(sessions.sessionTrainer.userId),
      createMockExercise(sessions.sessionTrainer.userId),
    ]).then((exs) => exs.map((exercise) => exercise.id));
  });

  afterAll(async () => {
    for (const exerciseId of exercises) {
      await cleanupMockExercise(exerciseId);
    }
  });

  it("should create a plan", async () => {
    const result = await caller.plansRouter.createPlan({
      clientId: sessions.recordClient.id,
      endDate: new Date(),
      startDate: new Date(),
      workouts: [
        {
          day: 1,
          exercises: exercises.map((id) => ({
            id,
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
    expect(result.id).toBeDefined();
    planId = result.id;
  });

  it("should update a plan", async () => {
    const result = await caller.plansRouter.updatePlan({
      planId,
      startDate: new Date(),
    });
    expect(result).toBeDefined();
    expect(result.id).toBe(planId);
  });

  it("should get a plan", async () => {
    const result = await caller.plansRouter.getPlan({ planId });
    expect(result).toBeDefined();
    expect(result.id).toBe(planId);
  });

  it("should delete a plan", async () => {
    const result = await caller.plansRouter.deletePlan({ planId });
    expect(result).toBeDefined();
    expect(result.count).toBe(1);
  });
});
