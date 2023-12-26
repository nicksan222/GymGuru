import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";

describe("Exercise update", () => {
  it("should update an exercise", async () => {
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

    const updateResult = await caller.exercisesRouter.updateExercise({
      id: result?.id,
      category: "test2",
    });

    expect(updateResult).toBeDefined();
    expect(updateResult?.count).toBe(1);

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
