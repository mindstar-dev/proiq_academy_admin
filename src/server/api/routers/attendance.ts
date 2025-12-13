import { $Enums } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AttendanceInput, GetAttendanceInput } from "~/types";

export const attendanceRouter = createTRPCRouter({
  getDynamicattendance: protectedProcedure
    .input(GetAttendanceInput)
    .query(async ({ ctx, input }) => {
      const isAllCourses = input.courseId === "All";

      // 1️⃣ Fetch existing attendance
      const attendance = await ctx.prisma.attendance.findMany({
        where: {
          centreId: input.centreId,
          date: input.date,
          ...(isAllCourses ? {} : { courseId: input.courseId }),
        },
        select: {
          centreId: true,
          courseId: true,
          date: true,
          status: true,
          studentId: true,
          centre: { select: { name: true } },
          course: { select: { name: true } },
          student: { select: { name: true, parentName: true } },
        },
      });

      if (attendance.length > 0) {
        return attendance;
      }

      // 2️⃣ Fetch students (ALL courses OR single course)
      const students = await ctx.prisma.student.findMany({
        where: {
          centreId: input.centreId,
          ...(isAllCourses
            ? {}
            : {
                course: {
                  some: {
                    id: input.courseId,
                  },
                },
              }),
        },
        select: {
          studentId: true,
          centreId: true,
          name: true,
          parentName: true,
          course: {
            select: {
              id: true,
              name: true,
            },
          },
          centre: {
            select: {
              name: true,
            },
          },
        },
      });

      // 3️⃣ Create default ABSENT attendance
      const defaultAttendance = students.flatMap((student) =>
        (isAllCourses
          ? student.course
          : student.course.filter((c) => c.id === input.courseId)
        ).map((course) => ({
          studentId: student.studentId,
          centreId: student.centreId,
          courseId: course.id,
          date: new Date(input.date),
          status: "ABSENT" as $Enums.AttendanceStatus,
          centre: { name: student.centre.name },
          course: { name: course.name },
          student: { name: student.name, parentName: student.parentName },
        }))
      );

      return defaultAttendance;
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
