import * as z from "zod";

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
