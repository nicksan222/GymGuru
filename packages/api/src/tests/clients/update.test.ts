import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";

describe("Client update", () => {
  it("should update a client", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    const result = await prisma.client.create({
      data: {
        birthDate: new Date(),
        email: "c@c.com",
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

    const randomEmail =
      Math.random().toString(36).substring(7) +
      "@" +
      Math.random().toString(36).substring(7) +
      ".com";

    const updateResult = await caller.clientRouter.updateClient({
      id: result?.id,
      email: randomEmail,
    });

    expect(updateResult).toBeDefined();
    expect(updateResult?.count).toBe(1);

    // Delete the exercise
    const resultDeletion = await prisma.client.delete({
      where: {
        id: result?.id,
      },
    });

    expect(resultDeletion).toBeDefined();
    expect(resultDeletion?.id).toBe(result?.id);
  });
});
