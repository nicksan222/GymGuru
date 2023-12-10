import { z } from "zod";

export const createExerciseInput = z.object({
  name: z.string(),
  description: z.string(),
  primaryMuscle: z.string(),
  secondaryMuscles: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.array(z.string()).optional(),
  category: z.string(),
});

export const updateExerciseInput = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  primaryMuscle: z.string().optional(),
  secondaryMuscles: z.string().optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.array(z.string()).optional(),
  category: z.string().optional(),
});

export const deleteExerciseInput = z.object({
  id: z.string(),
});

export const getExerciseInput = z.object({
  id: z.string(),
});

export const listExercisesInput = z.object({
  muscleGroup: z.string().optional(),
});
