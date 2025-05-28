import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { CourseInput, UpdateCourseInput } from "~/types";
async function generateCustomCourseId() {
  const lastUser = await prisma.course.findFirst({
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
  const newId = `PROIQ/CR/${String(newIdNumber).padStart(5, "0")}`;
  return newId;
}
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
      orderBy: {
        id: "asc",
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
        orderBy: {
          id: "asc",
        },
      });

      return courses;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          faculty: {
            select: {
              name: true,
              email: true,
            },
          },
          centre: {
            select: { name: true },
          },
        },
      });
      if (!course) return null;

      // Map faculty and centre to extract only the ids
      const facultyIds = course.faculty.map((f) => `${f.name}, ${f.email}`);
      const centreIds = course.centre.map((c) => c.name);

      return {
        id: course.id,
        name: course.name,
        faculty: facultyIds,
        centre: centreIds,
      };
    }),
  create: protectedProcedure
    .input(CourseInput)
    .mutation(async ({ ctx, input }) => {
      const id = await generateCustomCourseId();
      const emails = input.facultyNames.map((str) => str.split(", ").pop());
      return ctx.prisma.course.create({
        data: {
          id: id,
          name: input.name,
          centre: {
            connect: input.centreNames.map((centreName) => ({
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
  update: protectedProcedure
    .input(UpdateCourseInput)
    .mutation(async ({ ctx, input }) => {
      const emails = input.facultyNames.map((str) => str.split(", ").pop());
      return ctx.prisma.course.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          centre: {
            connect: input.centreNames.map((centreName) => ({
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
