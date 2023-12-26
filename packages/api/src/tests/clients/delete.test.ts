import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";

describe("Client deletion", () => {
  it("should delete a client", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    const result = await prisma.client.create({
      data: {
        birthDate: new Date(),
        email: "",
        firstName: "",
        lastName: "",
        trainerId: sessions.sessionTrainer.userId,
      },
      select: {
        id: true,
      },
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    // Delete the exercise
    const resultDeletion = await caller.clientRouter.deleteClient({
      id: result?.id,
    });

    expect(resultDeletion).toBeDefined();

    // Check if the exercise has been deleted
    const resultCheck = await prisma.exercise.findUnique({
      where: {
        id: result?.id,
      },
    });

    expect(resultCheck).toBeNull();
  });
});
