import { prisma } from "@acme/db";

export async function cleanupMockExercise(exerciseId: string) {
  const result = await prisma.exercise.delete({
    where: {
      id: exerciseId,
    },
  });

  expect(result).toBeDefined();
  expect(result?.id).toBe(exerciseId);
}
