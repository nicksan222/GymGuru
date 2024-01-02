import { Client, prisma } from "@acme/db";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";

export async function createMockWorkoutRecord(
  planDayId: string,
  sessions: {
    sessionClient: SignedInAuthObject;
    sessionTrainer: SignedInAuthObject;
    recordClient: Client;
  },
  nRecords = 1,
) {
  // Does the planDayId exists?
  const planDay = await prisma.workoutPlanDay.findUnique({
    where: {
      id: planDayId,
    },
  });

  if (!planDay) throw new Error("Plan Day not found");

  // Inserting nRecords for the logged sessionClient user
  for (let i = 0; i < nRecords; i += 1) {}

  // Inserting nRecords for not the logged user
  for (let i = 0; i < nRecords; i += 1) {}
}
