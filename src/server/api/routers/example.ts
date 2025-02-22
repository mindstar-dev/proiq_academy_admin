import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { DemoInput } from "~/types";

export const exampleRouter = createTRPCRouter({
  demoCreate: protectedProcedure
    .input(DemoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.demo.create({
        data: {
          id: input.id,
        },
      });
    }),
});
