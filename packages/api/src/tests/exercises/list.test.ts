import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";

describe("Exercise deletion", () => {
  it("should list exercises", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    const result = await prisma.exercise.createMany({
      data: [
        {
          category: "test",
          name: "Bench Press",
          description: "test",
          imageUrl: "test",
          primaryMuscle: MuscleTarget.Pettorali,
          secondaryMuscles: "",
          trainerId: sessions.sessionTrainer.userId,
        },
        {
          category: "test",
          name: "Squat",
          description: "test",
          imageUrl: "test",
          primaryMuscle: MuscleTarget.Glutei,
          secondaryMuscles: "",
          trainerId: sessions.sessionTrainer.userId,
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result?.count).toBe(2);

    const exercises = await caller.exercisesRouter.listExercises({});
    expect(exercises).toBeDefined();
    expect(exercises?.length).toBe(2);

    // Delete the exercises
    const resultDeletion = await prisma.exercise.deleteMany({
      where: {
        trainerId: sessions.sessionTrainer.userId,
      },
    });

    expect(resultDeletion).toBeDefined();
  });
});
