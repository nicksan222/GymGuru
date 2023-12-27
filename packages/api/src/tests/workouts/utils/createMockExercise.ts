import { MuscleTarget, prisma } from "@acme/db";

export async function createMockExercise(trainerId: string) {
  const result = await prisma.exercise.create({
    data: {
      name: "Test Exercise",
      category: "Test Category",
      primaryMuscle: MuscleTarget.Abduttori,
      secondaryMuscles: "",
      trainerId,
    },
  });

  return result;
}
