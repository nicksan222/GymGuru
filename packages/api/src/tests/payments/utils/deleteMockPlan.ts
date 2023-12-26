import { Client, prisma } from "@acme/db";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";

export async function deleteMockPlan(planId: string) {
  const result = await prisma.workoutPlan.delete({
    where: {
      id: planId,
    },
  });

  expect(result).toBeDefined();
  expect(result?.id).toBe(planId);
}
