import { AsyncReturnType } from "../utils/asyncReturnType";
import getMockIdentities from "../utils/getMockIdentities";
import { getMockTrainerTRPC } from "../utils/getMockTrainerTRPC";

describe("Payment CRUD operations", () => {
  let sessions: AsyncReturnType<typeof getMockIdentities>;
  let caller: AsyncReturnType<typeof getMockTrainerTRPC>;
  let exerciseId: string;
  let planId: string;
  let createdPaymentId: string;

  beforeAll(async () => {
    sessions = await getMockIdentities();
    caller = await getMockTrainerTRPC(sessions.sessionTrainer.userId);

    const exercise = await caller.exercisesRouter.createExercise({
      category: "test",
      name: "Bench Press",
      description: "test",
      imageUrl: ["test"],
      primaryMuscle: "Pettorali", // Use string literal if MuscleTarget enum is not available
      secondaryMuscles: [],
    });

    expect(exercise).toBeDefined();
    expect(exercise?.id).toBeDefined();
    exerciseId = exercise?.id;

    // Creating a mock plan
    const plan = await caller.plansRouter.createPlan({
      clientId: sessions.recordClient.id,
      endDate: new Date(),
      startDate: new Date(),
      workouts: [
        {
          day: 1,
          exercises: [
            {
              id: exerciseId,
              order: 1,
              series: [
                {
                  order: 1,
                  reps: 10,
                  concentric: 1,
                  eccentric: 1,
                  hold: 0,
                  rest: 60,
                },
              ],
              description: "test",
            },
          ],
        },
      ],
    });

    expect(plan).toBeDefined();
    expect(plan?.id).toBeDefined();
    planId = plan?.id;
  });

  afterAll(async () => {
    // Deleting the mock plan
    await caller.plansRouter.deletePlan({
      planId,
    });

    await caller.exercisesRouter.deleteExercise({
      id: exerciseId,
    });
  });

  it("should create a payment", async () => {
    const result = await caller.paymentsRouter.createPayment({
      amount: 100,
      clientId: sessions.recordClient.id,
      planId,
    });

    expect(result).toBeDefined();
    expect(result?.id).toBeDefined();

    createdPaymentId = result?.id;
  });

  it("should list payments", async () => {
    const payments = await caller.paymentsRouter.listPayments({
      clientId: sessions.recordClient.id,
    });

    expect(payments).toBeDefined();
    expect(payments.length).toBeGreaterThan(0);
  });

  it("should delete a payment", async () => {
    const resultDeletion = await caller.paymentsRouter.deletePayment({
      id: createdPaymentId,
    });

    expect(resultDeletion).toBeDefined();
    expect(resultDeletion?.count).toBe(1);
  });
});
