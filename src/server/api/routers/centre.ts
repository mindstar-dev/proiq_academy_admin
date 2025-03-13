import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { CentreInput } from "~/types";
async function generateCustomCentreId() {
  const lastUser = await prisma.centre.findFirst({
    orderBy: { id: "desc" },
  });

  let newIdNumber = 1;

  if (lastUser) {
    const lastId = lastUser.id;
    const match = lastId.match(/(\d+)$/); // Extract numeric part
    if (match) {
      newIdNumber = parseInt(match[0]) + 1;
    }
  }

  // Format new ID
  const newId = `PROIQ/C/${String(newIdNumber).padStart(5, "0")}`;
  return newId;
}
export const centreRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.centre.count();
  }),
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
  getAllCentreByUserId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.role === "Admin") {
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
  getAllCentreNamesByUserId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.role === "Admin") {
        const centres = await ctx.prisma.centre.findMany({
          select: { name: true },
        });
        return centres.map((centre) => centre.name); // Return only names
      }

      const userCentres = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          centres: {
            select: { name: true },
          },
        },
      });

      return userCentres?.centres.map((centre) => centre.name) || []; // Return only names
    }),

  create: protectedProcedure
    .input(CentreInput)
    .mutation(async ({ ctx, input }) => {
      const id = await generateCustomCentreId();
      return ctx.prisma.centre.create({
        data: {
          id: id,
          location: input.location,
          name: input.name,
        },
      });
    }),
});
