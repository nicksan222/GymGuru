import { z } from "zod";

export const createClientInput = z.object({
  firstName: z.string().min(2, { message: "First name is too short" }),
  lastName: z.string().min(2, { message: "Last name is too short" }),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.date(),
  medicalHistory: z.string().optional(),
});

export const updateClientInput = z.object({
  id: z.string(),
  firstName: z.string().min(2, { message: "First name is too short" }),
  lastName: z.string().min(2, { message: "Last name is too short" }),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.date(),
  medicalHistory: z.string().optional(),
});

export const deleteClientInput = z.object({
  id: z.string(),
});

export const getClientInput = z.object({
  id: z.string(),
});
