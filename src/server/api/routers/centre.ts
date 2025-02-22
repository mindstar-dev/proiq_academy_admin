import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const centreRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const centres = await ctx.prisma.centre.findMany();
    const centreNames: string[] = centres.map((centre) => centre.name);
    return centreNames;
  }),
});
