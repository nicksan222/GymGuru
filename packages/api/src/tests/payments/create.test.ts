import getMockIdentities from "../utils/getMockIdentities";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { prisma } from "@acme/db";

describe("Payment creation", () => {
  it("should create a payment", async () => {
    const caller = await getMockTrainerTRPC();
    const sessions = await getMockIdentities();

    const result = await caller.paymentsRouter.createPayment({
      amount: 100,
      clientId: sessions.recordClient.id,
      planId: "test",
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
