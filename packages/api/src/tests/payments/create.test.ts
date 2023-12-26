import getMockIdentities from "../utils/getMockIdentities";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { Client, prisma } from "@acme/db";
import { createMockPlan } from "./utils/createMockPlan";
import { deleteMockPlan } from "./utils/deleteMockPlan";

describe("Payment creation", () => {
  it("should create a payment", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    // Creating a plan
    const plan = await createMockPlan(sessions);

    expect(plan).toBeDefined();
    expect(plan?.id).toBeDefined();

    const result = await caller.paymentsRouter.createPayment({
      amount: 100,
      clientId: sessions.recordClient.id,
      planId: plan?.id,
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    // delete the payment
    const paymentDeletion = await prisma.payment.delete({
      where: {
        id: result?.id,
      },
      select: {
        id: true,
      },
    });

    expect(paymentDeletion).toBeDefined();
    expect(paymentDeletion?.id).toBeDefined();

    // delete the plan
    await deleteMockPlan(plan?.id);
  });
});
