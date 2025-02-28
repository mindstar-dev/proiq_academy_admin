import { StudentInput } from "~/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const studentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(StudentInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.student.create({
        data: {
          address: input.address,
          classTiming: input.classTiming,
          courseDuration: input.courseDuration,
          course: {
            connect: input.courseNames.map((courseName) => ({
              name: courseName,
            })),
          },
          idProof: input.idProof,
          idProofType: input.idProofType,
          imageUrl: input.imageUrl,
          classDays: input.classDays,
          name: input.name,
          parentContactNumber1: input.parentContactNumber1,
          parentName: input.parentName,
          parentOccupation: input.parentOccupation,
          readdmission: false,
          parentContactNumber2: input.parentContactNumber2,
          centre: {
            connect: {
              id: input.centreId,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(StudentInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.student.update({
        where: {
          studentId: input.studentId,
        },
        data: {
          address: input.address,
          classTiming: input.classTiming,
          courseDuration: input.courseDuration,
          course: {
            connect: input.courseNames.map((courseName) => ({
              name: courseName,
            })),
          },
          classDays: input.classDays,
          idProof: input.idProof,
          idProofType: input.idProofType,
          imageUrl: input.imageUrl,
          name: input.name,
          parentContactNumber1: input.parentContactNumber1,
          parentName: input.parentName,
          parentOccupation: input.parentOccupation,
          readdmission: false,
          parentContactNumber2: input.parentContactNumber2,
          centre: {
            connect: {
              name: input.centreId,
            },
          },
        },
      });
    }),
  getById: protectedProcedure
    .input(
      z.object({
        studentId: z.string({ required_error: "Student ID can't be empty" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findUnique({
        where: {
          studentId: input.studentId,
        },
        select: {
          studentId: true,
          address: true,
          centre: {
            select: {
              name: true,
            },
          },
          classDays: true,
          classTiming: true,
          course: {
            select: {
              name: true,
            },
          },
          courseDuration: true,
          idProof: true,
          idProofType: true,
          imageUrl: true,
          name: true,
          parentContactNumber1: true,
          parentContactNumber2: true,
          parentName: true,
          parentOccupation: true,
          centreId: true,
          readdmission: true,
        },
      });
      if (!student) {
        return null;
      }
      return {
        ...student,
        courseNames: student.course.map((c) => c.name),
        centreId: student.centre.name,
      };
    }),
  getByCentreAndCourseName: protectedProcedure
    .input(
      z.object({
        centreName: z.string({ required_error: "Centre Name can't be empty" }),
        courseName: z.string({ required_error: "Centre Name can't be empty" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const students = await ctx.prisma.student.findMany({
        where: {
          centre: {
            name: input.centreName,
          },
          course: {
            every: {
              name: input.courseName,
            },
          },
        },
      });
      return students;
    }),
  getByCentreAndCourseId: protectedProcedure
    .input(
      z.object({
        centreId: z.string({ required_error: "Centre Id can't be empty" }),
        courseId: z.string({ required_error: "Centre Id can't be empty" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const students = await ctx.prisma.student.findMany({
        where: {
          centre: {
            id: input.centreId,
          },
          course: {
            every: {
              id: input.courseId,
            },
          },
        },
      });
      return students;
    }),
});
