import { Exercise, MuscleTarget } from "@acme/db";

export const exercise: Partial<Exercise> = {
  category: "test",
  name: "test",
  description: "test",
  imageUrl: "test",
  instructions: "test",
  primaryMuscle: MuscleTarget.Abduttori,
  secondaryMuscles: "test",
  videoUrl: "test",
};
