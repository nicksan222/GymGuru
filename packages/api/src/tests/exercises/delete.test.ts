import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";

describe("Exercise deletion", () => {
  it("should delete an exercise", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    const result = await prisma.exercise.create({
      data: {
        category: "test",
        name: "Bench Press",
        description: "test",
        imageUrl: "test",
        primaryMuscle: MuscleTarget.Pettorali,
        secondaryMuscles: "",
        trainerId: sessions.sessionTrainer.userId,
      },
      select: {
        id: true,
      },
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    // Delete the exercise
    const resultDeletion = await caller.exercisesRouter.deleteExercise({
      id: result?.id,
    });

    expect(resultDeletion).toBeDefined();

    // Check if the exercise has been deleted
    const resultCheck = await prisma.exercise.findUnique({
      where: {
        id: result?.id,
      },
    });

    expect(resultCheck).toBeNull();
  });
});
