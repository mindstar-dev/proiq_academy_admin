import { ReaddmissionInput, StudentInput } from "~/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { $Enums } from "@prisma/client";
import { prisma } from "~/server/db";
async function generateCustomStudentId() {
  const lastUser = await prisma.student.findFirst({
    orderBy: { studentId: "desc" },
  });

  let newIdNumber = 1;

  if (lastUser) {
    const lastId = lastUser.studentId;
    const match = lastId.match(/(\d+)$/); // Extract numeric part
    if (match) {
      newIdNumber = parseInt(match[0]) + 1;
    }
  }

  // Format new ID
  const newId = `PROIQ/S/${String(newIdNumber).padStart(5, "0")}`;
  return newId;
}
export const studentRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.student.count();
  }),
  create: protectedProcedure
    .input(StudentInput)
    .mutation(async ({ ctx, input }) => {
      const id = await generateCustomStudentId();
      return ctx.prisma.student.create({
        data: {
          studentId: id,
          address: input.address,
          dob: input.dob,
          status: $Enums.UserStatus.CONTINUE,
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
          readdmissionPaymentStatus: false,
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
          dob: input.dob,
          status: input.status as $Enums.UserStatus,
          parentContactNumber2: input.parentContactNumber2,
          centre: {
            connect: {
              name: input.centreId,
            },
          },
        },
      });
    }),
  readmission: protectedProcedure
    .input(ReaddmissionInput)
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const arr: any[] = [];
      input.studentData.map((studentData) => {
        const transaction = ctx.prisma.student.update({
          where: {
            studentId: studentData.studentId,
          },
          data: {
            readdmission: studentData.readdmission,
            readdmissionPaymentStatus: studentData.readdmissionPaymentStatus,
            readdmissionCourseId: input.readdmissionCourseId,
            course: {
              connect: { id: input.readdmissionCourseId },
              disconnect: { id: input.courseId },
            },
          },
        });
        arr.push(transaction);
        if (studentData.readdmissionPaymentStatus) {
          const transaction = ctx.prisma.payment.create({
            data: {
              studentId: studentData.studentId,
              amountPaid: Number(input.readdmissionPaymentAmount),
              centreId: input.centreId,
              courseId: input.readdmissionCourseId,
              paymentFor: "Readdmission Fees",
              status: $Enums.PaymentStatus.PAID,
              paymentDate: date,
            },
          });
          arr.push(transaction);
        }
      });
      return await ctx.prisma.$transaction(arr);
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
          dob: true,
          status: true,
          course: {
            select: {
              name: true,
            },
          },

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
            some: {
              id: input.courseId,
            },
          },
        },
        select: {
          centre: {
            select: {
              name: true,
            },
          },
          course: {
            select: {
              name: true,
            },
          },
          studentId: true,
          name: true,
          parentName: true,
          readdmission: true,
          readdmissionCourseId: true,
        },
      });
      return students;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const students = await ctx.prisma.student.findMany({
      select: {
        studentId: true,
        address: true,
        centre: {
          select: {
            name: true,
          },
        },
        classDays: true,
        dob: true,
        status: true,
        course: {
          select: {
            name: true,
          },
        },

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
        readdmissionCourseId: true,
        readdmissionPaymentStatus: true,
        payments: {
          take: 1, // Get only the most recent payment
          orderBy: {
            paymentDate: "desc", // Sort payments by date (newest first)
          },
          select: {
            amountPaid: true,
            paymentDate: true,
            paymentFor: true,
          },
        },
      },
      orderBy: {
        studentId: "asc",
      },
    });
    return students;
  }),
});
