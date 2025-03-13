import { $Enums } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { UserInput, UserUpdateInput } from "~/types";
async function generateCustomUserId() {
  const lastUser = await prisma.user.findFirst({
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
  const newId = `PROIQ/AT/${String(newIdNumber).padStart(5, "0")}`;
  return newId;
}
export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(UserInput)
    .mutation(async ({ ctx, input }) => {
      const id = await generateCustomUserId();
      return ctx.prisma.user.create({
        data: {
          id: id,
          dob: input.dob,
          email: input.email.toLowerCase(),
          imageUrl: input.imageUrl,
          name: input.name,
          password: input.password,
          phoneNumber: input.phoneNumber,
          userType: input.userType,
          address: input.address,
          idProof: input.idProof,
          idProofType: input.idProofType,
          status: "CONTINUE" as $Enums.UserStatus,
          centres: {
            connect: input.centres.map((centreName) => ({ name: centreName })),
          },
        },
      });
    }),
  update: protectedProcedure
    .input(UserUpdateInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          dob: input.dob,
          email: input.email.toLowerCase(),
          imageUrl: input.imageUrl,
          name: input.name,
          phoneNumber: input.phoneNumber,
          userType: input.userType,
          address: input.address,
          idProof: input.idProof,
          idProofType: input.idProofType,
          status: input.status as $Enums.UserStatus,
          centres: {
            connect: input.centres.map((centreName) => ({ name: centreName })),
          },
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx, input }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        phoneNumber: true,
        imageUrl: true,
        status: true,
        address: true,
        centres: {
          select: {
            name: true,
          },
        },
        courses: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        userType: "asc",
      },
    });
    return users;
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string({ required_error: "User ID can't be empty" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          userType: true,
          phoneNumber: true,
          imageUrl: true,
          dob: true,
          status: true,
          idProof: true,
          idProofType: true,
          address: true,
          centres: {
            select: {
              name: true,
            },
          },
        },
      });
      return users;
    }),
  getByIdWithArray: protectedProcedure
    .input(
      z.object({
        id: z.string({ required_error: "User ID can't be empty" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          userType: true,
          phoneNumber: true,
          imageUrl: true,
          status: true,
          idProof: true,
          idProofType: true,
          dob: true,
          address: true,
          centres: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!user) return null;
      return {
        ...user,
        centres: user.centres.map((centre) => centre.name),
      };
    }),
});
