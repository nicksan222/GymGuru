import { MuscleTarget } from "@prisma/client";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";

describe("Client creation", () => {
  it("should create a client", async () => {
    const caller = await getMockTrainerTRPC();

    const result = await caller.clientRouter.createClient({
      birthDate: new Date(),
      email: "test@aa.com",
      firstName: "Hello",
      lastName: "World",
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

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
