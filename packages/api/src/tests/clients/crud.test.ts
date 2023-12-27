import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";
import getMockIdentities from "../utils/getMockIdentities";
import { AsyncReturnType } from "../utils/asyncReturnType";

describe("Client CRUD operations", () => {
  let createdClientId: string;
  let sessions: AsyncReturnType<typeof getMockIdentities>;
  let caller: AsyncReturnType<typeof getMockTrainerTRPC>;

  beforeAll(async () => {
    sessions = await getMockIdentities();
    caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);
  });

  it("should create a client", async () => {
    if (!sessions.sessionClient.user?.emailAddresses[0]?.emailAddress) {
      throw new Error("Client email address not found");
    }

    // Creating a different client, since the one in the session is already created
    const result = await caller.clientRouter.createClient({
      birthDate: new Date(),
      email: sessions.sessionClient.user?.emailAddresses[0]?.emailAddress + "1",
      firstName: "Hello",
      lastName: "World",
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();
    createdClientId = sessions.recordClient.id;

    // Deleting right away, since we don't need it
    const resultDelete = await prisma.client.delete({
      where: {
        id: result?.id,
      },
    });

    expect(resultDelete).toBeDefined();
    expect(resultDelete?.id).toBe(result?.id);
  });

  it("should list clients", async () => {
    const clients = await caller.clientRouter.listClients();
    expect(clients).toBeDefined();
    expect(clients.some((client) => client.id === createdClientId)).toBe(true);
  });

  it("should update a client", async () => {
    const randomEmail = `${Math.random()
      .toString(36)
      .substring(7)}@example.com`;

    const updateResult = await caller.clientRouter.updateClient({
      id: createdClientId,
      email: randomEmail,
    });

    expect(updateResult).toBeDefined();
    expect(updateResult?.count).toBe(1);
  });

  it("should delete a client", async () => {
    const resultDeletion = await caller.clientRouter.deleteClient({
      id: createdClientId,
    });

    expect(resultDeletion).toBeDefined();

    const resultCheck = await prisma.client.findUnique({
      where: {
        id: createdClientId,
      },
    });

    expect(resultCheck).toBeNull();
  });
});
