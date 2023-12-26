import { MuscleTarget } from "@prisma/client";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";

describe("Exercise creation", () => {
  it("should create an exercise", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    const result = await caller.exercisesRouter.createExercise({
      category: "test",
      name: "Bench Press",
      description: "test",
      imageUrl: ["test"],
      primaryMuscle: MuscleTarget.Pettorali,
      secondaryMuscles: [],
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    // Delete the exercise
    const resultDeletion = await prisma.exercise.delete({
      where: {
        id: result?.id,
      },
    });

    expect(resultDeletion).toBeDefined();
    expect(resultDeletion?.id).toBe(result?.id);
  });
});
