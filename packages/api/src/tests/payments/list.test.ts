import getMockIdentities from "../utils/getMockIdentities";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";
import { Client, WorkoutPlan, prisma } from "@acme/db";
import { SignedInAuthObject } from "@clerk/clerk-sdk-node";
import { createMockPlan } from "./utils/createMockPlan";
import { deleteMockPlan } from "./utils/deleteMockPlan";

async function createMockPayment(
  sessions: {
    sessionClient: SignedInAuthObject;
    sessionTrainer: SignedInAuthObject;
    recordClient: Client;
  },
  plan: WorkoutPlan,
) {
  if (!plan || !plan.id) throw new Error("Plan is not defined");

  const result = await prisma.payment.create({
    data: {
      amount: 100,
      Client: {
        connect: {
          id: sessions.recordClient.id,
        },
      },
      WorkoutPlan: {
        connect: {
          id: plan.id,
        },
      },
      trainerId: sessions.sessionTrainer.userId,
    },
  });

  expect(result).toBeDefined();
  expect(result?.id).toBeDefined();

  return result;
}

async function deleteMockPayment(paymentId: string) {
  const result = await prisma.payment.delete({
    where: {
      id: paymentId,
    },
  });

  expect(result).toBeDefined();
  expect(result?.id).toBe(paymentId);
}

describe("Payments list", () => {
  it("should list payments", async () => {
    const sessions = await getMockIdentities();
    const caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    // Creating a plan
    const plan = await createMockPlan(sessions);

    expect(plan).toBeDefined();
    expect(plan?.id).toBeDefined();

    const payment = await createMockPayment(sessions, plan);

    // Listing the payments
    const payments = await caller.paymentsRouter.listPayments({
      clientId: sessions.recordClient.id,
    });

    expect(payments).toBeDefined();
    expect(payments?.length).toBeGreaterThan(0);

    // delete the payment
    await deleteMockPayment(payment?.id);

    // delete the plan
    await deleteMockPlan(plan?.id);
  });
});
