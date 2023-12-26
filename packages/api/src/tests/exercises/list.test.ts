import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";

describe("Exercise deletion", () => {
  it("should list exercises", async () => {
    const caller = await getMockTrainerTRPC("exercise_deletion");
    const idCaller = await getMockTrainerId("exercise_deletion");
    expect(idCaller).toBeDefined();

    const result = await prisma.exercise.createMany({
      data: [
        {
          category: "test",
          name: "Bench Press",
          description: "test",
          imageUrl: "test",
          primaryMuscle: MuscleTarget.Pettorali,
          secondaryMuscles: "",
          trainerId: idCaller ?? "",
        },
        {
          category: "test",
          name: "Squat",
          description: "test",
          imageUrl: "test",
          primaryMuscle: MuscleTarget.Glutei,
          secondaryMuscles: "",
          trainerId: idCaller ?? "",
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
        trainerId: idCaller ?? "",
      },
    });

    expect(resultDeletion).toBeDefined();
  });
});
