import { protectedProcedure } from "../../trpc";
import { fetchClientIdFromEmail } from "../../utils/fetchClientIdFromEmail";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

const getRecordsFroPlanDay = protectedProcedure
  .input(
    z.object({
      planDayId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const userId = await fetchClientIdFromEmail(ctx);

    const result = await ctx.prisma.workoutRecordSet.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                WorkoutRecord: {
                  trainerId: ctx.auth.userId,
                },
              },
              {
                WorkoutRecord: {
                  Client: {
                    id: userId,
                  },
                },
              },
            ],
          },
          {
            WorkoutSet: {
              WorkoutPlanDay: {
                id: input.planDayId,
              },
            },
          },
        ],
      },
    });

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not find records for the requested plan day",
      });
    }

    return result;
  });

export default getRecordsFroPlanDay;
