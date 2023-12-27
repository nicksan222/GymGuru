import { PrismaClient } from "@acme/db";
import sessionClient from "./getMockClientContext";
import sessionTrainer from "./getMockTrainerContext";

const prisma = new PrismaClient();

const getMockIdentities = async () => {
  // Does the client exist?
  let client = await prisma.client.findFirst({
    where: {
      email: sessionClient.user?.emailAddresses[0]?.emailAddress,
    },
  });

  if (!client) {
    if (
      !sessionClient.user?.emailAddresses[0]?.emailAddress ||
      !sessionClient.user?.firstName ||
      !sessionClient.user?.lastName
    ) {
      throw new Error("Missing client data");
    }

    // Create the client
    client = await prisma.client.create({
      data: {
        email: sessionClient.user?.emailAddresses[0]?.emailAddress,
        firstName: sessionClient.user?.firstName,
        lastName: sessionClient.user?.lastName,
        trainerId: sessionTrainer.userId,
        birthDate: new Date(),
      },
    });

    if (!client || !client.id) {
      throw new Error("No client found");
    }
  }

  return {
    sessionClient,
    sessionTrainer,
    recordClient: client,
  };
};

export default getMockIdentities;
