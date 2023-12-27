import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";
import { AsyncReturnType } from "../utils/asyncReturnType";

describe("Exercise CRUD operations", () => {
  let createdExerciseId: string;
  let sessions: AsyncReturnType<typeof getMockIdentities>;
  let caller: AsyncReturnType<typeof getMockTrainerTRPC>;

  beforeAll(async () => {
    sessions = await getMockIdentities();
    caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);
  });

  it("should create an exercise", async () => {
    const result = await caller.exercisesRouter.createExercise({
      category: "test",
      name: "Bench Press",
      description: "test",
      imageUrl: ["test"],
      primaryMuscle: "Pettorali", // Use string literal if MuscleTarget enum is not available
      secondaryMuscles: [],
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();
    createdExerciseId = result?.id;
  });

  it("should list exercises", async () => {
    const exercises = await caller.exercisesRouter.listExercises({});
    expect(exercises).toBeDefined();
    expect(
      exercises.some((exercise) => exercise.id === createdExerciseId),
    ).toBe(true);
  });

  it("should update an exercise", async () => {
    const updateResult = await caller.exercisesRouter.updateExercise({
      id: createdExerciseId,
      category: "test2",
    });

    expect(updateResult).toBeDefined();
    expect(updateResult?.count).toBe(1);
  });

  it("should delete an exercise", async () => {
    const resultDeletion = await caller.exercisesRouter.deleteExercise({
      id: createdExerciseId,
    });

    expect(resultDeletion).toBeDefined();

    // Check if the exercise has been deleted
    const resultCheck = await prisma.exercise.findUnique({
      where: {
        id: createdExerciseId,
      },
    });

    expect(resultCheck).toBeNull();
  });
});
