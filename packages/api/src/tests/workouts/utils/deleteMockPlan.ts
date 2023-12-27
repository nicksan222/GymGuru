import { prisma } from "@acme/db";

export async function deleteMockPlan(planId: string) {
  const plan = await prisma.workoutPlan.findMany({
    where: {
      id: planId,
    },
    include: {
      WorkoutPlanDay: {
        include: {
          WorkoutExercise: {
            include: {
              WorkoutSet: true,
            },
          },
        },
      },
    },
  });

  expect(plan).toBeDefined();
  expect(plan.length).toBeGreaterThan(0);

  const resultDeletePlanSets = await prisma.workoutSet.deleteMany({
    where: {
      WorkoutExercise: {
        WorkoutPlanDay: {
          workoutPlanId: planId,
        },
      },
    },
  });

  expect(resultDeletePlanSets).toBeDefined();
  expect(resultDeletePlanSets?.count).toBeGreaterThan(0);

  const resultDeletePlanExercises = await prisma.workoutExercise.deleteMany({
    where: {
      WorkoutPlanDay: {
        workoutPlanId: planId,
      },
    },
  });

  expect(resultDeletePlanExercises).toBeDefined();
  expect(resultDeletePlanExercises?.count).toBeGreaterThan(0);

  const resultDeletePlan = await prisma.workoutPlanDay.deleteMany({
    where: {
      workoutPlanId: planId,
    },
  });

  expect(resultDeletePlan).toBeDefined();
  expect(resultDeletePlan?.count).toBeGreaterThan(0);

  const result = await prisma.workoutPlan.delete({
    where: {
      id: planId,
    },
  });

  expect(result).toBeDefined();
  expect(result?.id).toBe(planId);
}
