import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { fetchClientIdFromEmail } from "../../utils/fetchClientIdFromEmail";

const getNextWorkoutExercise = protectedProcedure.query(async ({ ctx }) => {
  const userId = await fetchClientIdFromEmail(ctx);

  const workoutStarted = await ctx.prisma.workoutRecord.findFirst({
    where: {
      Client: { id: userId },
      completedAt: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      WorkoutPlanDay: {
        include: {
          WorkoutExercise: {
            include: { WorkoutSet: true },
          },
        },
      },
      WorkoutRecordSet: true,
    },
  });

  if (!workoutStarted) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No workout in progress found, please start a workout",
    });
  }

  const lastSet = await ctx.prisma.workoutRecordSet.findFirst({
    where: { WorkoutRecord: { id: workoutStarted.id } },
    orderBy: { createdAt: "desc" },
  });

  if (!lastSet) {
    return (
      workoutStarted.WorkoutPlanDay.WorkoutExercise[0]?.WorkoutSet[0] ?? null
    );
  }

  // Determine the next set
  let nextExerciseFound = false;
  for (const exercise of workoutStarted.WorkoutPlanDay.WorkoutExercise) {
    if (nextExerciseFound) {
      return exercise.WorkoutSet[0] ?? null;
    }

    const isCurrentExercise = exercise.WorkoutSet.some(
      (set) => set.id === lastSet.workoutSetId,
    );

    if (isCurrentExercise) {
      nextExerciseFound = true; // Next iteration will give us the first set of the next exercise
    }
  }

  // No more exercises to perform, mark the workout as completed
  await ctx.prisma.workoutRecord.update({
    where: { id: workoutStarted.id },
    data: { completedAt: new Date() },
  });

  throw new TRPCError({
    code: "NOT_FOUND",
    message: "No more sets to do, workout is now set to ended",
  });
});

export default getNextWorkoutExercise;
