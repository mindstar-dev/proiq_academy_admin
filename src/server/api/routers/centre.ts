import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { CentreInput } from "~/types";

export const centreRouter = createTRPCRouter({
  getAllNames: protectedProcedure.query(async ({ ctx }) => {
    const centres = await ctx.prisma.centre.findMany();
    const centreNames: string[] = centres.map((centre) => centre.name);
    return centreNames;
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const centres = await ctx.prisma.centre.findMany({
      select: {
        name: true,
        location: true,
        id: true,
        faculties: {
          select: {
            name: true,
          },
        },
      },
    });
    return centres;
  }),
  getAllNamesByUserId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.role === "admin") {
        const centres = await ctx.prisma.centre.findMany();
        return centres;
      }
      const centres = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          centres: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });

      return centres?.centres;
    }),
  create: protectedProcedure
    .input(CentreInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.centre.create({
        data: {
          location: input.location,
          name: input.name,
        },
      });
    }),
});
