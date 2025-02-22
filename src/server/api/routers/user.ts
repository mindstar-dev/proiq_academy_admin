import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { UserInput } from "~/types";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(UserInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: {
          email: input.email,
          imageUrl: "demo url",
          name: input.name,
          password: input.password,
          phoneNumber: input.phoneNumber,
          userType: input.userType,
          centres: {
            connect: input.centres.map((centreName) => ({ name: centreName })),
          },
        },
      });
    }),
});
