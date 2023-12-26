import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";

describe("Client deletion", () => {
  it("should delete a client", async () => {
    const caller = await getMockTrainerTRPC();
    const idCaller = await getMockTrainerId();
    expect(idCaller).toBeDefined();

    const result = await prisma.client.create({
      data: {
        birthDate: new Date(),
        email: "",
        firstName: "",
        lastName: "",
        trainerId: idCaller ?? "",
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
