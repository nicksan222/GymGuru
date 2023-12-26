import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";

describe("Client deletion", () => {
  it("should list clients", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    const result = await prisma.client.createMany({
      data: [
        {
          birthDate: new Date(),
          email:
            sessions.sessionClient.user?.emailAddresses[0]?.emailAddress +
              "1" ?? "",
          firstName: "",
          lastName: "",
          trainerId: sessions.sessionTrainer.userId,
        },
        {
          birthDate: new Date(),
          email:
            sessions.sessionClient.user?.emailAddresses[0]?.emailAddress +
              "2" ?? "",
          firstName: "",
          lastName: "",
          trainerId: sessions.sessionTrainer.userId,
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result?.count).toBeGreaterThanOrEqual(2);

    const exercises = await caller.clientRouter.listClients();
    expect(exercises).toBeDefined();
    expect(exercises?.length).toBeGreaterThanOrEqual(2);

    // Delete the exercises
    const resultDeletion = await prisma.client.deleteMany({
      where: {
        id: {
          in: exercises?.map((e) => e.id),
        },
      },
    });

    expect(resultDeletion).toBeDefined();
  });
});
