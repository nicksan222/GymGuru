import { MuscleTarget } from "@acme/db";
import { protectedProcedure } from "../../trpc";
import * as z from "zod";

const createExercise = protectedProcedure
  .input(
    z.object({
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
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.exercise.create({
      data: {
        ...input,
        imageUrl: (input.imageUrl || []).join(","),
        trainerId: ctx.auth.userId,
        secondaryMuscles: (input.secondaryMuscles || []).join(","),
        primaryMuscle: input.primaryMuscle as MuscleTarget,
      },
    });
  });

export default createExercise;
