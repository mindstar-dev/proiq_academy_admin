import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { CourseInput } from "~/types";

export const courseRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.course.count();
  }),
  getAllCourseNames: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.prisma.course.findMany();
    const courseNames: string[] = courses.map((course) => course.name);
    return courseNames;
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.prisma.course.findMany({
      select: {
        id: true,
        name: true,
        centre: {
          select: {
            name: true,
          },
        },
        faculty: {
          select: {
            name: true,
          },
        },
      },
    });
    return courses;
  }),
  getCourseByCentreName: protectedProcedure
    .input(
      z.object({
        centreName: z.string({ required_error: "Centre Name can't be empty" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const courses = await ctx.prisma.course.findMany({
        where: {
          centre: {
            some: {
              name: input.centreName,
            },
          },
        },
      });
      const courseNames: string[] = courses.map((course) => course.name);
      return courseNames;
    }),
  getCourseNameByCentreId: protectedProcedure
    .input(
      z.object({
        centreId: z.string({ required_error: "Centre Id can't be empty" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const courses = await ctx.prisma.course.findMany({
        where: {
          centre: {
            some: {
              id: input.centreId,
            },
          },
        },
      });
      const courseNames: string[] = courses.map((course) => course.name);
      return courseNames;
    }),
  getCourseNameByMultipleCentreNames: protectedProcedure
    .input(
      z.object({
        centreNames: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const courses = await ctx.prisma.course.findMany({
        where: {
          centre: {
            some: {
              name: {
                in: input.centreNames,
              },
            },
          },
        },
      });

      const courseNames: string[] = courses.map((course) => course.name);
      return courseNames;
    }),

  getCourseByCentreId: protectedProcedure
    .input(
      z.object({
        centreId: z.string({ required_error: "Centre Id can't be empty" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const courses = await ctx.prisma.course.findMany({
        where: {
          centre: {
            some: {
              id: input.centreId,
            },
          },
        },
      });

      return courses;
    }),
  create: protectedProcedure
    .input(CourseInput)
    .mutation(async ({ ctx, input }) => {
      const emails = input.facultyIds.map((str) => str.split(", ").pop());
      console.log("emails", emails);
      return ctx.prisma.course.create({
        data: {
          name: input.name,
          centre: {
            connect: input.centreIds.map((centreName) => ({
              name: centreName,
            })),
          },
          faculty: {
            connect: emails.map((facultyEmail) => ({
              email: facultyEmail,
            })),
          },
        },
      });
    }),
});
