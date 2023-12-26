import { Client, prisma } from "@acme/db";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";

export async function createMockPlan(sessions: {
  sessionClient: SignedInAuthObject;
  sessionTrainer: SignedInAuthObject;
  recordClient: Client;
}) {
  const result = await prisma.workoutPlan.create({
    data: {
      endDate: new Date(),
      startDate: new Date(),
      Client: {
        connect: {
          id: sessions.recordClient.id,
        },
      },
      trainerId: sessions.sessionTrainer.userId,
    },
  });

  expect(result).toBeDefined();
  expect(result?.id).toBeDefined();

  return result;
}
