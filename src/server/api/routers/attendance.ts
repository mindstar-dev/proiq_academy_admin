import { $Enums } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AttendanceInput, GetAttendanceInput } from "~/types";

export const attendanceRouter = createTRPCRouter({
  getDynamicattendance: protectedProcedure
    .input(GetAttendanceInput)
    .query(async ({ ctx, input }) => {
      const attendance = await ctx.prisma.attendance.findMany({
        where: {
          centreId: input.centreId,
          courseId: input.courseId,
          date: input.date,
        },
        select: {
          centreId: true,
          courseId: true,
          date: true,
          status: true,
          studentId: true,
          centre: {
            select: {
              name: true,
            },
          },
          course: {
            select: { name: true },
          },
          student: {
            select: { name: true, parentName: true },
          },
        },
      });

      if (!attendance || attendance.length === 0) {
        const students = await ctx.prisma.student.findMany({
          where: {
            course: {
              every: {
                id: input.courseId,
              },
            },
          },
          select: {
            studentId: true,
            centreId: true,
            name: true,
            parentName: true,
            course: {
              where: {
                id: input.courseId,
              },
              select: {
                id: true,
                name: true,
              },
            },
            centre: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        const defaultAttendance = students.map((student) => ({
          studentId: student.studentId,
          centreId: student.centreId,
          courseId: input.courseId,
          date: new Date(input.date),
          status: "ABSENT" as $Enums.AttendanceStatus,
          centre: { name: student.centre.name },
          course: { name: student?.course[0]?.name },
          student: { name: student.name, parentName: student.parentName },
        }));

        console.log("defaultAttendance", defaultAttendance);
        return defaultAttendance;
      }

      console.log("attendance", attendance);
      return attendance;
    }),
  getStaticattendance: protectedProcedure
    .input(GetAttendanceInput)
    .query(async ({ ctx, input }) => {
      const attendance = await ctx.prisma.attendance.findMany({
        where: {
          centreId: input.centreId,
          courseId: input.courseId,
          date: input.date,
        },
        select: {
          centreId: true,
          courseId: true,
          date: true,
          status: true,
          studentId: true,
          centre: {
            select: {
              name: true,
            },
          },
          course: {
            select: { name: true },
          },
          student: {
            select: { name: true, parentName: true },
          },
        },
      });

      console.log("attendance", attendance);
      return attendance;
    }),
  markattendance: protectedProcedure
    .input(AttendanceInput)
    .mutation(async ({ ctx, input }) => {
      console.log("date", input[0]?.date.getTimezoneOffset());
      return await ctx.prisma.$transaction(
        input.map((attendance) =>
          ctx.prisma.attendance.upsert({
            where: {
              studentId_courseId_date: {
                studentId: attendance.studentId,
                courseId: attendance.courseId,
                date: attendance.date.toISOString(),
              },
            },
            update: {
              status: attendance.status,
            },
            create: {
              studentId: attendance.studentId,
              courseId: attendance.courseId,
              centreId: attendance.centreId,
              date: attendance.date.toISOString(),
              status: attendance.status,
            },
          })
        )
      );
    }),
});
