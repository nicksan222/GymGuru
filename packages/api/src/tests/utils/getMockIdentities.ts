import { Client, PrismaClient } from "@acme/db";
import sessionClient from "./getMockClientContext";
import sessionTrainer from "./getMockTrainerContext";

const prisma = new PrismaClient();

let instance: {
  sessionClient: typeof sessionClient;
  sessionTrainer: typeof sessionTrainer;
  recordClient: Client;
} | null = null;

const getMockIdentities = async () => {
  if (instance) {
    return instance;
  }

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

  instance = {
    sessionClient,
    sessionTrainer,
    recordClient: client,
  };

  return instance;
};

export default getMockIdentities;
