import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
const prisma = new PrismaClient();

const loginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
  role: z.string(),
});

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { type: "text", placeholder: "me@email.com" },
        password: { label: "password", type: "password" },
        role: { placeholder: "role", type: "text" },
      },
      async authorize(credentials, req) {
        const { email, password, role } = loginUserSchema.parse(credentials);

        const user = await prisma.user.findUnique({
          where: { email: email, userType: role },
        });
        if (!user) return null;

        const isPasswordCorrect = password === user.password;

        if (!isPasswordCorrect) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.userType,
          image: user.imageUrl,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Use token.role instead
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Store role in token
      }
      return token;
    },
  },
  pages: {
    signIn: "/user-creation",
    signOut: "/login",
  },
};

export default NextAuth(authOptions);
