import { StudentInput } from "~/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const studentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(StudentInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.student.create({
        data: {
          address: input.address,
          classTiming: input.classTiming,
          courseDuration: input.courseDuration,
          courseName: input.courseName,
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
});
