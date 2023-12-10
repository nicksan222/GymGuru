import { protectedProcedure } from "../../trpc";

const listTargetMuscles = protectedProcedure.query(async ({ ctx }) => {
  return ctx.prisma.exercise.findMany({
    where: {
      trainerId: ctx.auth.userId,
    },
    select: {
      primaryMuscles: true,
      secondaryMuscles: true,
    },
    distinct: ["primaryMuscles", "secondaryMuscles"],
  });
});

export default listTargetMuscles;
