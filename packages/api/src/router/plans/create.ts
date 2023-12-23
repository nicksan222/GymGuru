import { protectedProcedure } from "../../trpc";
import { createPlanInput } from "./types";

const createPlan = protectedProcedure
  .input(createPlanInput)
  .mutation(async ({ ctx, input }) => {
    // Extracting workouts and other plan details from input
    const { workouts, ...planDetails } = input;

    // Create the WorkoutPlan with basic details
    // We include only the basic details to reduce the complexity of the initial query
    const workoutPlan = await ctx.prisma.workoutPlan.create({
      data: {
        ...planDetails,
        trainerId: ctx.auth.userId, // Assigning the trainer ID from the user context
      },
    });

    // Check if there are workouts to be added to the plan
    if (workouts && workouts.length > 0) {
      // Using Promise.all for concurrent execution of database operations
      await Promise.all(
        workouts.map(async (workout) => {
          // Create WorkoutPlanDay for each workout day
          const workoutPlanDay = await ctx.prisma.workoutPlanDay.create({
            data: {
              day: workout.day,
              workoutPlanId: workoutPlan.id,
              trainerId: ctx.auth.userId,
            },
          });

          // Check if there are exercises for the workout day
          if (workout.exercises && workout.exercises.length > 0) {
            // Concurrently create WorkoutExercise records for each exercise in the workout day
            await Promise.all(
              workout.exercises.map((exercise) =>
                ctx.prisma.workoutExercise.create({
                  data: {
                    exerciseId: exercise.id,
                    workoutPlanDayId: workoutPlanDay.id, // Linking to the correct WorkoutPlanDay
                    order: exercise.order, // Preserving the order of exercises
                    trainerId: ctx.auth.userId,
                  },
                }),
              ),
            );
          }
        }),
      );
    }

    // Return the created workout plan
    return workoutPlan;
  });

export default createPlan;
