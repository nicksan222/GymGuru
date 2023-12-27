import * as z from "zod";

const uuidSchema = z.string();
const positiveNumberSchema = z.number().min(0, {
  message: "Il numero deve essere positivo",
});

export const seriesSchema = z.object({
  reps: positiveNumberSchema,
  concentric: positiveNumberSchema,
  eccentric: positiveNumberSchema,
  hold: positiveNumberSchema,
  rest: positiveNumberSchema,
  order: positiveNumberSchema,
});

export const exerciseSchema = z.object({
  id: uuidSchema,
  series: z.array(seriesSchema),
  order: positiveNumberSchema,
  description: z.string().optional(),
});

export const workoutSchema = z.object({
  day: z.number().min(1).max(7, { message: "Il giorno deve essere tra 1 e 7" }),
  exercises: z.array(exerciseSchema),
});

export const createPlanInput = z.object({
  clientId: uuidSchema,
  startDate: z
    .date()
    .or(z.string())
    .transform((arg) => new Date(arg)),
  endDate: z
    .date()
    .or(z.string())
    .transform((arg) => new Date(arg)),
  workouts: z.array(workoutSchema).optional(),
});
