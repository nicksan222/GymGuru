import { z } from "zod";

export const createExerciseInput = z.object({
  name: z
    .string({
      invalid_type_error: "Il nome deve essere una stringa",
      required_error: "Il nome è obbligatorio",
    })
    .min(1, { message: "Il nome è obbligatorio" }),
  description: z.string({
    invalid_type_error: "La descrizione deve essere una stringa",
    required_error: "La descrizione è obbligatoria",
  }),
  primaryMuscle: z.string({
    required_error: "Il muscolo primario è obbligatorio",
  }),
  secondaryMuscles: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.array(z.string()),
  category: z.string({
    required_error: "La categoria è obbligatoria",
  }),
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
  filterIds: z.array(z.string()).optional(),
});
