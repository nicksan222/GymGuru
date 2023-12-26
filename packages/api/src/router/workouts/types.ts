import * as z from "zod";

export const inputStartedWorkout = z.object({
  workoutId: z.string(),
});

export const inputFinishedWorkout = z.object({
  workoutId: z.string(),
});

export const recordWorkoutSet = z.object({
  workoutId: z.string(),
  exerciseId: z.string(),
  setId: z.string(),
  reps: z.number(),
  weight: z.number(),
  rest: z.number(),
});

export const getNextWorkoutExercise = z.object({
  workoutId: z.string(),
});
