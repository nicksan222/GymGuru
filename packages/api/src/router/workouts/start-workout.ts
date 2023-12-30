import { protectedProcedure } from "../../trpc";
import * as z from "zod";
import { fetchClientIdFromEmail } from "../../utils/fetchClientIdFromEmail";
import { conflictError, notFoundError } from "./start-workout-types";

const startWorkout = protectedProcedure
  .input(
    z.object({
      workoutId: z.string().min(1, "Workout ID must not be empty"),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = await fetchClientIdFromEmail(ctx);

    // Check for existing workout and fetch workout plan day in one query
    const [currentWorkout, workoutPlanDay] = await Promise.all([
      ctx.prisma.workoutRecord.findFirst({
        where: {
          Client: { id: userId },
          completedAt: null,
        },
      }),
      ctx.prisma.workoutPlanDay.findFirst({
        where: { id: input.workoutId },
        include: { WorkoutPlan: true },
      }),
    ]);

    // Conflict error if a workout is currently running
    if (currentWorkout) throw conflictError;

    // Not found error if the workout plan day doesn't exist or doesn't match the user
    if (!workoutPlanDay || workoutPlanDay.WorkoutPlan.clientId !== userId) {
      throw notFoundError;
    }

    // Create a new workout record
    return ctx.prisma.workoutRecord.create({
      data: {
        trainerId: workoutPlanDay.trainerId,
        Client: { connect: { id: userId } },
        WorkoutPlanDay: { connect: { id: input.workoutId } },
      },
    });
  });

export default startWorkout;
