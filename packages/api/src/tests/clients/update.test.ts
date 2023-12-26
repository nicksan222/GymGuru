import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";

describe("Client update", () => {
  it("should update a client", async () => {
    const caller = await getMockTrainerTRPC();
    const idCaller = await getMockTrainerId();
    expect(idCaller).toBeDefined();

    const result = await prisma.client.create({
      data: {
        birthDate: new Date(),
        email: "c@c.com",
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

    const updateResult = await caller.clientRouter.updateClient({
      id: result?.id,
      email: "d@d.com",
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
