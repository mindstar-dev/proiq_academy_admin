import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { centreRouter } from "./routers/centre";
import { studentRouter } from "./routers/student";
import { courseRouter } from "./routers/course";
import { paymentRouter } from "./routers/payment";
import { attendanceRouter } from "./routers/attendance";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  centre: centreRouter,
  course: courseRouter,
  student: studentRouter,
  payment: paymentRouter,
  attendance: attendanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
