import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"
import type { Adapter } from "next-auth/adapters"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      checks: ["state"],
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Kakao may not return email — allow login without it
      if (account?.provider === "kakao" && !user.email) {
        // Use kakao account id as fallback identifier
      }

      // Update OAuth IDs on user record (only for existing users)
      try {
        if (user.id && account?.provider === "google" && account.providerAccountId) {
          await prisma.user.update({
            where: { id: user.id },
            data: { googleId: account.providerAccountId },
          })
        }

        if (user.id && account?.provider === "kakao" && account.providerAccountId) {
          await prisma.user.update({
            where: { id: user.id },
            data: { kakaoId: account.providerAccountId },
          })
        }
      } catch {
        // User might not exist yet on first sign-in (adapter creates it)
      }

      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Fetch fresh credit balance
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { creditBalance: true },
        })
        session.user.creditBalance = dbUser?.creditBalance ?? 0
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "database",
  },
})
