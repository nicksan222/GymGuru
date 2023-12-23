import * as z from "zod";

const uuidErrorMessage = "ID non valido";
const greaterThanZeroMessage = "Deve essere maggiore di 0";

const uuidSchema = z.string().uuid({ message: uuidErrorMessage });
const positiveNumberSchema = z
  .number()
  .min(1, { message: greaterThanZeroMessage });

const seriesSchema = z.object({
  reps: positiveNumberSchema,
  concentric: positiveNumberSchema,
  eccentric: positiveNumberSchema,
  hold: positiveNumberSchema,
  rest: positiveNumberSchema,
  order: positiveNumberSchema,
});

const exerciseSchema = z.object({
  id: uuidSchema,
  series: z.array(seriesSchema).optional(),
  order: positiveNumberSchema,
});

const workoutSchema = z.object({
  day: z.number().min(1).max(7, { message: "Il giorno deve essere tra 1 e 7" }),
  name: z.string().min(1, { message: "Il nome è obbligatorio" }),
  exercises: z.array(exerciseSchema).optional(),
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
