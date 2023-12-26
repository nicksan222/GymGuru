import { MuscleTarget } from "@prisma/client";
import {
  getMockTrainerId,
  getMockTrainerTRPC,
} from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";

describe("Client deletion", () => {
  it("should list clients", async () => {
    const caller = await getMockTrainerTRPC("clients_deletion");
    const idCaller = await getMockTrainerId("clients_deletion");
    expect(idCaller).toBeDefined();

    const result = await prisma.client.createMany({
      data: [
        {
          birthDate: new Date(),
          email: "a@a.com",
          firstName: "",
          lastName: "",
          trainerId: idCaller ?? "",
        },
        {
          birthDate: new Date(),
          email: "b@b.com",
          firstName: "",
          lastName: "",
          trainerId: idCaller ?? "",
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result?.count).toBe(2);

    const exercises = await caller.clientRouter.listClients();
    expect(exercises).toBeDefined();
    expect(exercises?.length).toBe(2);

    // Delete the exercises
    const resultDeletion = await prisma.client.deleteMany({
      where: {
        trainerId: idCaller ?? "",
      },
    });

    expect(resultDeletion).toBeDefined();
  });
});
